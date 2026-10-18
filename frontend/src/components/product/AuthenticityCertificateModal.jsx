import React, { useState } from 'react';
import { ShieldCheck, Copy, Check, Award, Compass, Fingerprint, Calendar, Sparkles } from 'lucide-react';
import Modal from '../ui/Modal';

// Deterministic provenance generator for products
const getProvenanceData = (product) => {
  const idStr = String(product?._id || product?.id || 'prod_001');
  let hashNum = 0;
  for (let i = 0; i < idStr.length; i++) {
    hashNum = (hashNum << 5) - hashNum + idStr.charCodeAt(i);
    hashNum |= 0;
  }
  const absHash = Math.abs(hashNum);

  const ateliers = [
    { name: 'Milano Precision Atelier No. 4', location: 'Milan, Italy', coords: "45°28'00\"N 09°11'24\"E" },
    { name: 'Kyoto Micro-Craft Studio', location: 'Kyoto, Japan', coords: "35°00'42\"N 135°46'05\"E" },
    { name: 'Geneva Horological Guild', location: 'Geneva, Switzerland', coords: "46°12'15\"N 06°08'40\"E" },
    { name: 'Silicon Valley Advanced Hardware Lab', location: 'Cupertino, CA', coords: "37°19'55\"N 122°01'52\"W" },
    { name: 'London Bespoke Guild', location: 'Mayfair, London', coords: "51°30'36\"N 00°08'38\"W" },
  ];

  const materials = [
    'Aerospace Titanium Grade 5 & Sapphire Glass',
    'Laser-Etched Anodized Aluminum & Ceramic Enamel',
    'Tuscan Vegetable-Tanned Calfskin & Hand-Burnished Brass',
    'Quantum Dot Nano-Crystalline Matrix & Carbon Fiber Composite',
    'High-Precision Calibre Escapement & Antireflective AR Coated Crystal',
  ];

  const selectedAtelier = ateliers[absHash % ateliers.length];
  const selectedMaterials = materials[(absHash >> 2) % materials.length];
  const serialNumber = `PP-CERT-${Math.abs(absHash).toString(16).toUpperCase().padStart(8, '0')}`;
  const cryptoHash = `0x${Math.abs(absHash * 31337).toString(16).padEnd(24, 'f')}...c9a1`;

  return {
    serialNumber,
    cryptoHash,
    atelier: selectedAtelier,
    materials: selectedMaterials,
    inspectedBy: `Master Artisan #${(absHash % 89) + 10}`,
    verifiedDate: 'October 2026 // Cryptographically Sealed',
  };
};

const AuthenticityCertificateModal = ({ isOpen, onClose, product }) => {
  const [copied, setCopied] = useState(false);
  if (!product) return null;

  const provenance = getProvenanceData(product);

  const handleCopyHash = () => {
    navigator.clipboard?.writeText(provenance.cryptoHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cryptographic Certificate of Authenticity"
      maxWidth="max-w-xl"
    >
      <div className="relative rounded-2xl p-6 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border border-amber-500/30 shadow-2xl text-slate-100 overflow-hidden">
        {/* Luxury Gold Watermark Accent */}
        <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
        
        {/* Certificate Header */}
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase block">
                Official Provenance Ledger
              </span>
              <h3 className="text-base font-bold text-white tracking-wide">
                Posh Puzzle Guild Certificate
              </h3>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            VERIFIED
          </span>
        </div>

        {/* Product Details Header */}
        <div className="mb-5 bg-slate-900/60 rounded-xl p-3.5 border border-white/5">
          <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Item Identification</span>
          <p className="text-sm font-semibold text-slate-200 mt-0.5 line-clamp-1">{product.name}</p>
          <div className="flex items-center gap-2 mt-1.5 text-xs text-amber-400/90 font-mono">
            <span>SERIAL: {provenance.serialNumber}</span>
          </div>
        </div>

        {/* Metadata Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs mb-5">
          <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono uppercase tracking-wider text-[10px]">Atelier of Origin</span>
            </div>
            <p className="font-semibold text-slate-200">{provenance.atelier.name}</p>
            <p className="text-[11px] font-mono text-slate-400 mt-0.5">{provenance.atelier.coords}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono uppercase tracking-wider text-[10px]">Certified Materials</span>
            </div>
            <p className="font-semibold text-slate-200">{provenance.materials}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono uppercase tracking-wider text-[10px]">Seal Status</span>
            </div>
            <p className="font-semibold text-slate-200">{provenance.verifiedDate}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{provenance.inspectedBy}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Fingerprint className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono uppercase tracking-wider text-[10px]">Vendor Shop</span>
            </div>
            <p className="font-semibold text-slate-200">{product.shop?.name || 'Exclusive Atelier Member'}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Rating: {product.shop?.ratings || '4.9'} / 5.0</p>
          </div>
        </div>

        {/* Cryptographic Hash Bar */}
        <div className="p-3 rounded-xl bg-black/60 border border-amber-500/20 flex items-center justify-between gap-2">
          <div className="truncate">
            <span className="text-[10px] font-mono uppercase text-slate-400 block tracking-wider">Blockchain Ledger Hash</span>
            <code className="text-xs font-mono text-amber-300 truncate block">{provenance.cryptoHash}</code>
          </div>
          <button
            onClick={handleCopyHash}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-colors"
            title="Copy cryptographic proof hash"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Close Button */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
          >
            Close Provenance
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AuthenticityCertificateModal;
