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
	
	var _sharedPreferences: UserDefaults {
		return UserDefaults(suiteName: "D43XN356JM.com.charliemonroe.Downie.Safari")!
	}
	
	private func _open(_ url: String, postprocessingOption: String? = nil) {
		var components = URLComponents()
		components.scheme = "downie"
		components.host = "XUOpenLink"
//		components.path = "/"
		
		var queryItems: [URLQueryItem] = [URLQueryItem(name: "url", value: url), URLQueryItem(name: "version", value: "1.2")]
		if let postprocessing = postprocessingOption {
			queryItems.append(URLQueryItem(name: "postprocessing", value: postprocessing))
		}
		components.queryItems = queryItems
		
		guard let openURL = components.url else {
			return
		}
		
		let withoutActivation = _sharedPreferences.bool(forKey: "XUSafariSendLinksWithoutActivation")
		let options: NSWorkspace.LaunchOptions = withoutActivation ? .withoutActivation : []
		_ = try? NSWorkspace.shared.open(openURL, options: options, configuration: [:])
	}
	
	private func _openURL(in page: SFSafariPage, postprocessingOption: String? = nil) {
		page.getPropertiesWithCompletionHandler({ (propertiesOpt) in
			guard let properties = propertiesOpt else {
				print("Failed to get page properties in \(page.description)")
				return
			}
			
			print("Got page properties \(properties)")
			
			guard let url = properties.url else {
				return
			}
			self._open(url.absoluteString, postprocessingOption: postprocessingOption)
		})
	}
	
	override func messageReceived(withName messageName: String, from page: SFSafariPage, userInfo: [String : Any]? = nil) {
		if messageName == "XUOpenCurrentSite" {
			self._openURL(in: page)
		}
	}
	
	override func contextMenuItemSelected(withCommand command: String, in page: SFSafariPage, userInfo: [String : Any]? = nil) {
		if command == "SendSelectedLink" {
			guard let urlString = userInfo?["selectedLink"] as? String else {
				return
			}
			
			self._open(urlString)
			return
		}
		
		let postprocessingOption: String
		switch command {
		case "SendMP4":
			postprocessingOption = "mp4"
		case "SendAudio":
			postprocessingOption = "audio"
		case "SendPermute":
			postprocessingOption = "permute"
		default:
			return
		}
	
		self._openURL(in: page, postprocessingOption: postprocessingOption)
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
		if command == "SendSelectedLink" {
			validationHandler(userInfo?["selectedLink"] == nil, nil)
		} else {
			// Sending current link, but with certain postprocessing.
			if _sharedPreferences.bool(forKey: "XUSafariHidePostprocessingContextualMenuOptions") {
				validationHandler(true, nil)
				return
			}
			
			page.getPropertiesWithCompletionHandler({ (properties) in
				guard let properties = properties else {
					validationHandler(true, nil)
					return
				}
				
				guard let url = properties.url else {
					validationHandler(true, nil)
					return
				}
				
				guard url.scheme == "http" || url.scheme == "https" else {
					validationHandler(true, nil)
					return
				}
				
				validationHandler(false, nil)
			})
		}
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
