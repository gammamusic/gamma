package com.github.gmnt.app;

import java.awt.BorderLayout;
import java.awt.Desktop;
import java.awt.Dimension;
import java.awt.Toolkit;
import java.awt.Window;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.WindowEvent;
import java.net.InetAddress;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.List;

import javax.swing.BoxLayout;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JDialog;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.SwingConstants;
import javax.swing.WindowConstants;
import javax.swing.border.BevelBorder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ExitCodeGenerator;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import com.github.gmnt.app.service.BrowserService;
import com.github.gmnt.app.service.HandleMidiInputListener;
import com.github.gmnt.app.service.MidiInput;
import com.github.gmnt.app.service.MidiInputService;
import com.github.gmnt.app.service.MidiInputService.MidiInputDevice;
import com.github.vbauer.herald.annotation.Log;
import com.teamdev.jxbrowser.chromium.Browser;
import com.teamdev.jxbrowser.chromium.Callback;
import com.teamdev.jxbrowser.chromium.events.FailLoadingEvent;
import com.teamdev.jxbrowser.chromium.events.FinishLoadingEvent;
import com.teamdev.jxbrowser.chromium.events.FrameLoadEvent;
import com.teamdev.jxbrowser.chromium.events.LoadAdapter;
import com.teamdev.jxbrowser.chromium.events.LoadEvent;
import com.teamdev.jxbrowser.chromium.events.ProvisionalLoadingEvent;
import com.teamdev.jxbrowser.chromium.events.StartLoadingEvent;
import com.teamdev.jxbrowser.chromium.swing.BrowserView;
import java.util.logging.Level;
import java.util.logging.Logger;

import jportmidi.JPortMidiException;
import net.miginfocom.swing.MigLayout;

@Lazy
@Component
public class AppPrincipalFrame 
extends JFrame 
implements /*CommandLineRunner,*/ HandleMidiInputListener {

	private JLabel statusLabel = new JLabel("");
	private JComboBox<MidiInputDevice> comboBoxMidiInput = new JComboBox<MidiInputDevice>();
        private boolean isPageLoaded = false;
        
        @Log private Logger logger;

	@Autowired
	private ApplicationContext context;

	@Autowired
	private MidiInputService midiInputService;


	private MidiInputDevice lastMidiInputDevice = MidiInputDevice.DEVICE_FAKE_SELECT;

	public void startUp() {
		init();
		midiInputService.addHandleMidiInputListener(this);
	}

	private void setMidiInputDevice(MidiInputDevice input) {
		if (input == null) {
			return;
		}
		if (!lastMidiInputDevice.equals(input)) {
			try {
				if (midiInputService.isOpenInput()) {
					midiInputService.closeInput();
				}
			} catch (JPortMidiException e) {
				e.printStackTrace();
				showError(e.getMessage());
			}

			if (!input.equals(MidiInputDevice.DEVICE_FAKE_SELECT)) {
				try {
					midiInputService.openInput(input);
				} catch (JPortMidiException e) {
                                        showError(e.getMessage());
                                        logger.log(Level.SEVERE, "Erro ao selecionar MIDI INPUT" + input.getName(), e);
                                        resetAndUpdateInputDevices();
				}
			}
			lastMidiInputDevice = input;
		}
	}

	private void showError(String msg) {
		JDialog dialog = new JOptionPane(msg, JOptionPane.ERROR_MESSAGE, JOptionPane.DEFAULT_OPTION).createDialog("Erro"); 
		dialog.setAlwaysOnTop(true);
		dialog.setVisible(true);
		dialog.dispose();
	}

	public void init() {

		try {
			URL url = getClass().getResource("/icon.png");
	        ImageIcon imgicon = new ImageIcon(url);
	        super.setIconImage(imgicon.getImage());
	        super.setTitle("Gamma Music Notation Training - Versão: " + this.getClass().getPackage().getImplementationVersion());
	        
	        while(!BrowserService.getInstance().isReady()){
	        	Thread.sleep(500);
	        }
	        
	        Browser browser = BrowserService.getInstance().getBrowser();
	        BrowserView view = new BrowserView(BrowserService.getInstance().getBrowser());
	        this.add(view, BorderLayout.CENTER);
	        
	        JPanel addressPane = new JPanel(new MigLayout());
	  
	        this.setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE);
	        this.add(addressPane, BorderLayout.NORTH);
	        
	        this.setSize(450, 530);
	        this.setLocationRelativeTo(null);
	        
	        

			//combobox
			resetAndUpdateInputDevices();
			comboBoxMidiInput.addActionListener (new ActionListener () {
				public void actionPerformed(ActionEvent e) {
					setMidiInputDevice((MidiInputDevice)comboBoxMidiInput.getSelectedItem());
                                        statusLabel.setText("");
				}
			});
			addressPane.add(comboBoxMidiInput);
			
			//button
			//TODO: internationalization
			JButton resetAndUpdateButton = new JButton("Atualizar e Resetar");
			resetAndUpdateButton.addActionListener(new ActionListener() {
				public void actionPerformed(ActionEvent e) {
					resetAndUpdateInputDevices();
				}          
			});
			addressPane.add(resetAndUpdateButton, "wrap");

			
			JLabel labelServidor = new JLabel("Servidor:");
			addressPane.add(labelServidor, "wrap");
			
			//memo
			JTextField editServidor = new JTextField(String.format("http://%s:%s", InetAddress.getLocalHost().getHostName(), System.getProperties().getProperty("server.port")));
			editServidor.setEditable(false);
			
			addressPane.add(editServidor);
			
                        //apresenta o botão somente se estiver em modo desenvolvimento
                        if (this.getClass().getPackage().getImplementationVersion() == null) {
                            //TODO: internationalization
                            JButton recarregareButton = new JButton("Recarregar Página Principal");
                            recarregareButton.addActionListener(new ActionListener() {
                                    public void actionPerformed(ActionEvent e) {
                                            loadFrontEndUrl(browser, editServidor.getText());
                                    }          
                            });
                            addressPane.add(recarregareButton, "wrap");
                        }
	        
			JPanel statusPanel = new JPanel();
			statusPanel.setBorder(new BevelBorder(BevelBorder.LOWERED));
			this.add(statusPanel, BorderLayout.SOUTH);
			statusPanel.setPreferredSize(new Dimension(this.getWidth(), 16));
			statusPanel.setLayout(new BoxLayout(statusPanel, BoxLayout.X_AXIS));

			statusLabel.setHorizontalAlignment(SwingConstants.LEFT);
			statusPanel.add(statusLabel);
			
			centreWindow(this);
			
			loadFrontEndUrl(browser, editServidor.getText());
			
	        
	        
	        
	        browser.addLoadListener(new LoadAdapter() {
	            @Override
	            public void onStartLoadingFrame(StartLoadingEvent event) {
	                if (event.isMainFrame()) {
	                    System.out.println("Main frame has started loading");
	                }
	            }
	         
	            @Override
	            public void onProvisionalLoadingFrame(ProvisionalLoadingEvent event) {
	                if (event.isMainFrame()) {
	                    System.out.println("Provisional load was committed for a frame");
	                }
	            }
	         
	            @Override
	            public void onFinishLoadingFrame(FinishLoadingEvent event) {
	                if (event.isMainFrame() && !isPageLoaded) {
                            browser.executeJavaScript("document.querySelectorAll('button.button-block')[0].click()");
                            isPageLoaded = true;
                            setVisible(true);
                
                            if (Application.hasNewVersion()) {
                                JDialog dialog = new JOptionPane(String.format("Uma nova versão desse aplicativo (%s) está disponível em https://gammamusic.github.io/.", Application.version.getLast()),
                                                JOptionPane.INFORMATION_MESSAGE,
                                                JOptionPane.DEFAULT_OPTION).createDialog("Aviso");
                                dialog.setAlwaysOnTop(true);
                                dialog.setVisible(true);
                                dialog.dispose();
                            }
	                }
	            }
	         
	            @Override
	            public void onFailLoadingFrame(FailLoadingEvent event) {
	                int errorCode = event.getErrorCode().getErrorCode();
	                if (event.isMainFrame()) {
	                    System.out.println("Main frame has failed loading: " + errorCode);
	                }
	            }
	         
	            @Override
	            public void onDocumentLoadedInFrame(FrameLoadEvent event) {
	                System.out.println("Frame document is loaded.");
	            }
	         
	            @Override
	            public void onDocumentLoadedInMainFrame(LoadEvent event) {
	                System.out.println("Main frame document is loaded.");
	            }
	        });
	  
	        
			
			this.addWindowListener(new java.awt.event.WindowAdapter() {
				public void windowClosing(WindowEvent winEvt) {
					if (midiInputService.isOpenInput()) {
						try {
							midiInputService.closeInput();
						} catch (JPortMidiException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
					}

					SpringApplication.exit(context, new ExitCodeGenerator() {
						@Override
						public int getExitCode() {
							return 0;
						}					    	    
					});
					System.exit(0);
				}
			});

		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public static void loadFrontEndUrl(Browser browser, String url) {
		Browser.invokeAndWaitFinishLoadingMainFrame(browser, new Callback<Browser>() {
            @Override
            public void invoke(Browser value) {
                value.loadURL(url);
            }
        });
	}

	public static void centreWindow(Window frame) {
	    Dimension dimension = Toolkit.getDefaultToolkit().getScreenSize();
	    int x = (int) ((dimension.getWidth() - frame.getWidth()) / 2);
	    int y = (int) ((dimension.getHeight() - frame.getHeight()) / 2);
	    frame.setLocation(x, y);
	}
	
	public static void openWebpage(URI uri) {
	    Desktop desktop = Desktop.isDesktopSupported() ? Desktop.getDesktop() : null;
	    if (desktop != null && desktop.isSupported(Desktop.Action.BROWSE)) {
	        try {
	            desktop.browse(uri);
	        } catch (Exception e) {
	            e.printStackTrace();
	        }
	    }
	}

	public static void openWebpage(URL url) {
	    try {
	        openWebpage(url.toURI());
	    } catch (URISyntaxException e) {
	        e.printStackTrace();
	    }
	}

	private void resetAndUpdateInputDevices() {
		try {
                        statusLabel.setText("");
			if (midiInputService.isOpenInput()) {
				midiInputService.closeInput();
			}
			lastMidiInputDevice = MidiInputDevice.DEVICE_FAKE_SELECT;
			comboBoxMidiInput.removeAllItems();
			midiInputService.refreshDeviceLists();
			List<MidiInputDevice> list = midiInputService.listMidiInput();
			list.add(0, MidiInputDevice.DEVICE_FAKE_SELECT);

			for (MidiInputDevice device : list) {
				comboBoxMidiInput.addItem(device);
			}
		} catch (JPortMidiException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}



	@Override
	public void handleMidiInputNote(MidiInput note) {
		statusLabel.setText(String.format("Nota: %s %s", note.getNote(), note.getOn() ? " ON" : "OFF"));
	}
}