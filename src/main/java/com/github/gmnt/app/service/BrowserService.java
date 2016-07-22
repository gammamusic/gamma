package com.github.gmnt.app.service;

import com.teamdev.jxbrowser.chromium.Browser;
import com.teamdev.jxbrowser.chromium.BrowserPreferences;

public class BrowserService implements Runnable {
	
	private Browser browser;
	private boolean isReady;
	
	private static final BrowserService instance = new BrowserService();
	 
	protected BrowserService() {
	}
 
	// Runtime initialization
	// By defualt ThreadSafe
	public static BrowserService getInstance() {
		return instance;
	}

	@Override
	public void run() {
                String userAgent = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36 JxBrowser/6.5";
                BrowserPreferences.setUserAgent(userAgent);
		browser = new Browser();
		isReady = true;
	}

	public boolean isReady() {
		return isReady;
	}

	public void setReady(boolean isReady) {
		this.isReady = isReady;
	}

	public Browser getBrowser() {
		return browser;
	}

}
