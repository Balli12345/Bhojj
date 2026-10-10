import React, { useState } from 'react';
import JSZip from 'jszip';
import { 
  Download, 
  Server, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  ShieldCheck, 
  FileText, 
  Globe, 
  Terminal, 
  AlertCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';

export const HostingerDeploymentModal: React.FC = () => {
  const [downloading, setDownloading] = useState(false);
  const [copiedHtaccess, setCopiedHtaccess] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const htaccessContent = `<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Caching directives for Hostinger / LiteSpeed / Apache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>`;

  const handleCopyHtaccess = () => {
    navigator.clipboard.writeText(htaccessContent);
    setCopiedHtaccess(true);
    setTimeout(() => setCopiedHtaccess(false), 2500);
  };

  const handleDownloadZip = async () => {
    setDownloading(true);
    setDownloadSuccess(false);

    try {
      // 1. First attempt to fetch the real pre-packaged production zip with fresh cache-busting
      const res = await fetch('/bhojj-hostinger-deployment.zip?v=' + Date.now());
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bhojj-hostinger-deployment.zip';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        setDownloadSuccess(true);
        setDownloading(false);
        return;
      }
    } catch (e) {
      console.warn('Direct fetch failed, falling back to window location download...', e);
    }

    // Direct anchor navigation fallback
    const a = document.createElement('a');
    a.href = '/bhojj-hostinger-deployment.zip';
    a.download = 'bhojj-hostinger-deployment.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setDownloadSuccess(true);
    setDownloading(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Hero Banner with Big Download Button */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold">
            <Server className="w-3.5 h-3.5" />
            <span>Hostinger Cloud & Shared Hosting Ready</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Export Production Build for Hostinger
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Get the complete, pre-bundled static web distribution package configured with Apache/LiteSpeed 
            <code className="text-amber-300 font-mono mx-1">.htaccess</code> SPA rewrite rules, optimized assets, 
            and 4-in-1 multi-portal support (Customer, Restaurant, Delivery, and Super Admin).
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              id="download-hostinger-zip-btn"
              onClick={handleDownloadZip}
              disabled={downloading}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-sm transition-all shadow-lg shadow-orange-600/30 flex items-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? 'Preparing Deployment Zip...' : 'Download bhojj-hostinger-deployment.zip'}</span>
            </button>

            <a
              href="/bhojj-hostinger-deployment.zip"
              download="bhojj-hostinger-deployment.zip"
              className="px-4 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs transition-colors flex items-center gap-1.5 border border-slate-700"
            >
              <span>Direct Link Download</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {downloadSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Download started! Follow the 5-step Hostinger guide below to deploy.</span>
            </div>
          )}
        </div>
      </div>

      {/* 5-Step Hostinger Guide */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <h3 className="text-lg font-black text-slate-900 mb-1">
          Hostinger hPanel 5-Step Deployment Walkthrough
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Follow these simple steps to deploy Bhojj on your Hostinger domain in less than 2 minutes.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          
          {/* Step 1 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 relative">
            <div className="w-7 h-7 rounded-lg bg-orange-600 text-white font-black text-xs flex items-center justify-center">
              1
            </div>
            <h4 className="font-extrabold text-sm text-slate-900">Login to Hostinger</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Open <a href="https://hpanel.hostinger.com" target="_blank" rel="noreferrer" className="text-orange-600 font-bold underline">hpanel.hostinger.com</a> and select your active website domain.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 relative">
            <div className="w-7 h-7 rounded-lg bg-orange-600 text-white font-black text-xs flex items-center justify-center">
              2
            </div>
            <h4 className="font-extrabold text-sm text-slate-900">Open File Manager</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              In the left sidebar, click <strong>Files ➔ File Manager</strong>, then click <strong>Go to File Manager</strong>.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-300 space-y-2 relative">
            <div className="w-7 h-7 rounded-lg bg-orange-600 text-white font-black text-xs flex items-center justify-center">
              3
            </div>
            <h4 className="font-extrabold text-sm text-amber-950">Clean public_html</h4>
            <p className="text-xs text-amber-900 leading-relaxed">
              Open <strong>public_html</strong>. <strong>CRITICAL:</strong> Delete any old <code className="text-[11px] bg-amber-200/80 px-1 py-0.5 rounded font-bold">index.php</code>, <code className="text-[11px] bg-amber-200/80 px-1 py-0.5 rounded font-bold">setup.php</code>, or <code className="text-[11px] bg-amber-200/80 px-1 py-0.5 rounded font-bold">default.php</code> files to stop the old PHP screen from showing!
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 relative">
            <div className="w-7 h-7 rounded-lg bg-orange-600 text-white font-black text-xs flex items-center justify-center">
              4
            </div>
            <h4 className="font-extrabold text-sm text-slate-900">Upload & Extract</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Upload <code className="text-[11px] bg-slate-200 px-1 rounded">bhojj-hostinger-deployment.zip</code> into <code className="text-[11px] bg-slate-200 px-1 rounded">public_html</code>. Right click ➔ <strong>Extract here</strong>.
            </p>
          </div>

          {/* Step 5 */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2 relative">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
              5
            </div>
            <h4 className="font-extrabold text-sm text-slate-900">Live Website!</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Visit your domain URL! Ensure <strong>Force HTTPS (SSL)</strong> is enabled in Hostinger Security settings.
            </p>
          </div>

        </div>
      </div>

      {/* Hostinger .htaccess Verification & Copy Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                <FileText className="w-4 h-4" />
              </span>
              <h4 className="font-extrabold text-sm text-slate-900">
                Hostinger .htaccess File (Pre-bundled in Zip)
              </h4>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Ensures that refreshing pages or accessing direct URL routes never produces 404 errors on Apache/LiteSpeed.
            </p>
          </div>

          <button
            onClick={handleCopyHtaccess}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
          >
            {copiedHtaccess ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedHtaccess ? 'Copied to Clipboard!' : 'Copy .htaccess Code'}</span>
          </button>
        </div>

        <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
          {htaccessContent}
        </pre>
      </div>

      {/* Super Admin Credentials & Support Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h5 className="font-extrabold text-sm text-slate-900">Master Super Admin</h5>
          <p className="text-xs text-slate-500">
            Email: <strong className="text-slate-800 font-mono">admin@bhojj.in</strong><br />
            Password: <strong className="text-slate-800 font-mono">password123</strong>
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Globe className="w-4 h-4" />
          </div>
          <h5 className="font-extrabold text-sm text-slate-900">SSL & Domain Check</h5>
          <p className="text-xs text-slate-500">
            In Hostinger hPanel ➔ Security ➔ SSL, activate <strong>Lifetime Free SSL</strong> and turn <strong>Force HTTPS</strong> ON.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <h5 className="font-extrabold text-sm text-slate-900">Client-Side Persistence</h5>
          <p className="text-xs text-slate-500">
            All CMS edits (slider, header, footer, categories) are automatically preserved in browser storage for instant updates.
          </p>
        </div>

      </div>

    </div>
  );
};
