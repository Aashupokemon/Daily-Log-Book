import React from 'react';
import { Smartphone, Download, CheckCircle, ExternalLink, X, QrCode } from 'lucide-react';

interface AndroidInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstallPrompt?: () => void;
  isInstallable: boolean;
}

export const AndroidInstallModal: React.FC<AndroidInstallModalProps> = ({
  isOpen,
  onClose,
  onInstallPrompt,
  isInstallable,
}) => {
  if (!isOpen) return null;

  const currentUrl = window.location.href;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    currentUrl
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl my-8 border border-slate-200">
        <div className="flex items-start justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Install as Android App / APK
              </h2>
              <p className="text-xs text-slate-500">
                Run natively on your Android phone with offline local storage
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs text-slate-700">
          {/* Method 1: Instant WebAPK direct install on Android */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-emerald-950 text-sm flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Method 1: Direct 1-Tap Android Install (WebAPK)
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 font-mono">RECOMMENDED</span>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed mb-3">
              Android Chrome includes built-in <strong>WebAPK</strong> generation. When installed, Android automatically packages, compiles, and installs a native APK on your home screen and app launcher.
            </p>

            {isInstallable && onInstallPrompt ? (
              <button
                onClick={() => {
                  onInstallPrompt();
                  onClose();
                }}
                className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs shadow-xs transition-colors inline-flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Tap to Install on this Device</span>
              </button>
            ) : (
              <div className="bg-white p-3 rounded-lg border border-emerald-150 text-xs space-y-1 text-slate-700">
                <p className="font-medium text-slate-900">To install on an Android phone:</p>
                <ol className="list-decimal list-inside space-y-1 text-slate-600">
                  <li>Open this app URL in <strong>Google Chrome on Android</strong>.</li>
                  <li>Tap the <strong>⋮ (three dots menu)</strong> at top right.</li>
                  <li>Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                  <li>Android will generate the WebAPK and add the app icon to your phone!</li>
                </ol>
              </div>
            )}
          </div>

          {/* QR Code for quick opening on phone */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-center gap-4">
            <div className="bg-white p-2 rounded-lg border border-slate-200 shrink-0">
              <img
                src={qrCodeUrl}
                alt="Scan to open on phone"
                className="w-28 h-28 object-contain"
              />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <span className="font-bold text-slate-900 block text-xs flex items-center justify-center sm:justify-start gap-1.5">
                <QrCode className="w-4 h-4 text-slate-600" />
                Scan to Open on your Android Device
              </span>
              <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">
                Scan with your Android camera or QR scanner to open this URL directly on your phone and tap <em>Install App</em>.
              </p>
              <div className="mt-2 text-[11px] font-mono text-slate-500 truncate max-w-xs bg-white p-1.5 rounded border border-slate-200">
                {currentUrl}
              </div>
            </div>
          </div>

          {/* Method 2: Sideloadable standalone APK via PWABuilder */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="font-bold text-slate-900 block mb-1 text-xs">
              Method 2: Download Standalone Signed .APK File (PWABuilder)
            </span>
            <p className="text-slate-600 text-xs leading-relaxed mb-3">
              If you want an explicit <code>.apk</code> file to sideload via Android Package Installer or upload to Google Play Store, Microsoft & Google provide the free <strong>PWABuilder</strong> tool:
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={`https://www.pwabuilder.com?url=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors"
              >
                <span>Package into .APK on PWABuilder</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
              </a>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
