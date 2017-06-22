//
//  SafariExtensionHandler.swift
//  Downie Extension
//
//  Created by Charlie Monroe on 9/9/16.
//  Copyright © 2016 Charlie Monroe Software. All rights reserved.
//

import SafariServices
import os

class SafariExtensionHandler: SFSafariExtensionHandler {
	
	private func _open(_ url: String) {
		guard let openURL = URL(string: "downie://XUOpenLink?url=" + url) else {
			return
		}
		
		NSWorkspace.shared().open(openURL)
	}
	
	private func _openURL(in page: SFSafariPage) {
		page.getPropertiesWithCompletionHandler({ (propertiesOpt) in
			guard let properties = propertiesOpt else {
				print("Failed to get page properties in \(page.description)")
				return
			}
			
			print("Got page properties \(properties)")
			
			guard let url = properties.url else {
				return
			}
			self._open(url.absoluteString)
		})
	}
	
	override func messageReceived(withName messageName: String, from page: SFSafariPage, userInfo: [String : Any]? = nil) {
		if messageName == "XUOpenCurrentSite" {
			self._openURL(in: page)
		}
	}
	
	override func contextMenuItemSelected(withCommand command: String, in page: SFSafariPage, userInfo: [String : Any]? = nil) {
		guard let urlString = userInfo?["selectedLink"] as? String else {
			return
		}
		
		self._open(urlString)
	}
	
    override func toolbarItemClicked(in window: SFSafariWindow) {
        // This method will be called when your toolbar item is clicked.
		print("Toolbar item clicked \(window.description)")
		
		window.getActiveTab { (tab) in
			guard let tab = tab else {
				print("Failed to get active tab \(window.description)")
				return
			}
			
			print("Got active tab \(tab.description)")
			
			tab.getActivePage(completionHandler: { (page) in
				guard let page = page else {
					print("Failed to get active page \(tab.description)")
					return
				}
				
				print("Got active page \(page.description)")
				self._openURL(in: page)
			})
		}
    }
	
	override func validateContextMenuItem(withCommand command: String, in page: SFSafariPage, userInfo: [String : Any]? = nil, validationHandler: @escaping (Bool, String?) -> Void) {
		print(userInfo ?? "nil")
		validationHandler(userInfo?["selectedLink"] == nil, nil)
	}
    
    override func validateToolbarItem(in window: SFSafariWindow, validationHandler: @escaping ((Bool, String) -> Void)) {
		window.getActiveTab { (tab) in
			guard let tab = tab else {
				validationHandler(false, "")
				return
			}
			
			tab.getActivePage(completionHandler: { (page) in
				guard let page = page else {
					validationHandler(false, "")
					return
				}
				
				page.getPropertiesWithCompletionHandler({ (properties) in
					guard let properties = properties else {
						validationHandler(false, "")
						return
					}
					
					guard let url = properties.url else {
						validationHandler(false, "")
						return
					}
					
					guard url.scheme == "http" || url.scheme == "https" else {
						validationHandler(false, "")
						return
					}
					
					validationHandler(true, "")
				})
			})
		}
		
    }
    
}
