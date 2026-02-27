import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Printer, Download } from 'lucide-react';
import { RFQDetailsSheet } from './RFQDetailsSheet';
import type { RFQ } from '../../../types/rfq';

/* ── print helper: opens a new window with only the A4 sheet ── */
const printElement = (el: HTMLElement | null) => {
    if (!el) return;
    const win = window.open('', '_blank', 'width=900,height=1100');
    if (!win) return;
    win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>RFQ Details</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #fff; font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    @page { size: A4; margin: 0; }
    @media print { body { margin: 0; } .no-print { display: none !important; } }
  </style>
</head>
<body>${el.outerHTML}</body>
</html>`);
    win.document.close();
    win.onload = () => { win.focus(); win.print(); win.close(); };
};

interface RFQDetailsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    rfq: RFQ | null;
}

export const RFQDetailsDialog = ({ isOpen, onClose, rfq }: RFQDetailsDialogProps) => {
    const overlayRef = useRef<HTMLDivElement>(null);
    const sheetRef = useRef<HTMLDivElement>(null);

    // Close on backdrop click
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === overlayRef.current) onClose();
    };

    const handlePrint = () => {
        printElement(sheetRef.current);
    };

    if (!isOpen || !rfq) return null;

    return createPortal(
        <div
            ref={overlayRef}
            onClick={handleOverlayClick}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                background: 'rgba(0, 0, 0, 0.65)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                overflowY: 'auto',
                padding: '40px 16px 40px',
            }}
        >
            {/* Toolbar Area */}
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    width: '210mm',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                }}
            >
                <span style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#fff',
                    background: 'rgba(255,255,255,0.12)',
                    borderRadius: '999px',
                    padding: '4px 14px',
                    border: '1px solid rgba(255,255,255,0.18)',
                    backdropFilter: 'blur(8px)'
                }}>
                    {rfq.reference_number || 'RFQ Details'}
                </span>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {[{ icon: <Download size={15} />, label: 'Download', action: handlePrint },
                    { icon: <Printer size={15} />, label: 'Print', action: handlePrint }].map(({ icon, label, action }) => (
                        <button key={label} onClick={action} title={label}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '34px',
                                height: '34px',
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.12)',
                                border: '1px solid rgba(255,255,255,0.18)',
                                color: '#fff',
                                cursor: 'pointer',
                                backdropFilter: 'blur(8px)'
                            }}>
                            {icon}
                        </button>
                    ))}
                    <div style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.2)', margin: '0 2px' }} />
                    <button
                        onClick={onClose}
                        title="Close"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.12)',
                            border: '1px solid rgba(255,255,255,0.18)',
                            color: '#fff',
                            cursor: 'pointer',
                            backdropFilter: 'blur(8px)'
                        }}>
                        <X size={15} />
                    </button>
                </div>
            </div>

            {/* A4 sheet */}
            <div ref={sheetRef} onClick={e => e.stopPropagation()}>
                <RFQDetailsSheet rfq={rfq} onClose={onClose} />
            </div>
        </div>,
        document.body
    );
};
