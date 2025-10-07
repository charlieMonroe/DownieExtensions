//
//  SafariWebExtensionHandler.swift
//  Downie Extension New
//
//  Created by Charlie Monroe on 1/17/25.
//  Copyright © 2025 Charlie Monroe Software. All rights reserved.
//

import SafariServices
import os.log

class SafariWebExtensionHandler: NSObject, NSExtensionRequestHandling {

	enum SafariError: Error {
		case noInputItems
		case missingMessage
		case missingAction
		case unknownAction
	}
	
	
	private func _open(_ url: String, cookies: String?, postprocessingOption: String?) {
		var components = URLComponents()
		components.scheme = "downie"
		components.host = "XUOpenLink"
		
		var queryItems: [URLQueryItem] = [
			URLQueryItem(name: "url", value: url), URLQueryItem(name: "version", value: "1.2")
		]
		if let postprocessing = postprocessingOption {
			queryItems.append(URLQueryItem(name: "postprocessing", value: postprocessing))
		}
		
		if let cookies, !cookies.isEmpty, SafariPreferences.readValue(for: .passCookiesToDownie) {
			queryItems.append(URLQueryItem(name: "cookies", value: cookies))
		}
		
		components.queryItems = queryItems
		
		guard let openURL = components.url else {
			return
		}
		
		let withoutActivation = SafariPreferences.readValue(for: .sendLinksWithoutActivation)
		let configuration = NSWorkspace.OpenConfiguration()
		configuration.activates = !withoutActivation
		NSWorkspace.shared.open(openURL, configuration: configuration)
	}
	
    func beginRequest(with context: NSExtensionContext) {
		guard let request = context.inputItems.first as? NSExtensionItem else {
			context.cancelRequest(withError: SafariError.noInputItems)
			return
		}

		guard let message = request.userInfo?[SFExtensionMessageKey] as? [String : Any] else {
			os_log(.error, "[Downie Extension] No message in input item: %{public}@.", request)
			context.cancelRequest(withError: SafariError.missingMessage)
			return
        }
		
        os_log(.default, "[Downie Extension] Received message from browser.runtime.sendNativeMessage: %{public}@ (profile: %@)", String(describing: message))
		
		guard let action = message["action"] as? String else {
			os_log(.error, "[Downie Extension] No action in message: %{public}@.", message)
			context.cancelRequest(withError: SafariError.missingAction)
			return
		}
		
		switch action {
		case "open":
			guard let urlString = message["url"] as? String else {
				os_log(.error, "[Downie Extension] Open action with no URL in message: %{public}@.", message)
				return
			}
			
			self._open(urlString, cookies: message["cookies"] as? String, postprocessingOption: message["postprocessing"] as? String)
			
			let result = NSExtensionItem()
			result.userInfo = [
				SFExtensionMessageKey: [
					"closeTabAfterSendingLink": SafariPreferences.readValue(for: .closeTabAfterSendingLink)
				]
			]
			context.completeRequest(returningItems: [result])
			return
		default:
			os_log(.error, "[Downie Extension] Unknown action in message: %{public}@.", message)
			context.cancelRequest(withError: SafariError.unknownAction)
			return
		}		
    }

}
