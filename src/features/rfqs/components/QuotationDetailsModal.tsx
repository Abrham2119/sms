import { createPortal } from 'react-dom';
import { useEffect, useRef } from 'react';
import { X, Printer, Download } from 'lucide-react';
import type { Quotation } from '../../../types/rfq';

/* ── print helper: opens a new window with only the A4 sheet ── */
const printElement = (el: HTMLElement | null) => {
    if (!el) return;
    const win = window.open('', '_blank', 'width=900,height=1100');
    if (!win) return;
    win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Quotation</title>
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
interface QuotationDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    quotation: Quotation | null;
}

const fmtNum = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '0.0';
    return num.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
};

const fmtDate = (dateStr?: string | null, fallback = 'N/A') => {
    if (!dateStr) return fallback;
    try {
        return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(dateStr));
    } catch {
        return fallback;
    }
};

const InvoiceSheet = ({ q, onClose }: { q: Quotation; onClose: () => void }) => {
    const currency = q.currency || 'ETB';
    const qNumber = q.quotation_number || 'Q-2025-0001';
    const submittedAt = fmtDate(q.submitted_at);

    const totalAmount = parseFloat(q.total_amount) || 0;
    const itemsTotal = q.items.reduce((s, i) => s + parseFloat(i.total_price || '0'), 0);
    const totalDiscount = q.items.reduce((s, i) => s + (i.discount || 0), 0);
    const subTotal = itemsTotal + totalDiscount;

    const supLegal = q.supplier?.legal_name || 'Droga Consulting Services PLC';
    const supPhone = q.supplier?.phone || '+251 935 505 064';
    const supEmail = q.supplier?.email || 'Info@drogaconsulting.com';

    const thStyle = (isLast = false): React.CSSProperties => ({
        padding: '12px 14px',
        fontSize: '13px',
        fontWeight: 600,
        color: '#94a3b8',
        textAlign: 'left',
        whiteSpace: 'nowrap',
        borderRight: isLast ? 'none' : '1px solid #e2e8f0',
        borderBottom: '1px solid #e2e8f0',
        background: '#f8fafc',
    });

    const tdBase: React.CSSProperties = {
        padding: '16px 14px',
        fontSize: '13px',
        color: '#374151',
        borderBottom: '1px solid #f1f5f9',
        borderRight: 'none',
        verticalAlign: 'middle',
    };

    return (
        <div style={{
            width: '210mm',
            minHeight: '297mm',
            padding: '0',
            background: '#ffffff',
            fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
            fontSize: '13px',
            lineHeight: '1.6',
            boxShadow: '0 8px 40px rgba(0,0,0,0.22)',
            borderRadius: '3px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
        }}>
            <div style={{ padding: '16mm 16mm 10mm', flex: 1 }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBottom: '24px',
                    borderBottom: '2px solid #000000',
                    marginBottom: '20px',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img
                            src="/assets/logo/Droga logo 1.svg"
                            alt="Droga Logo"
                            style={{ height: 'auto', width: 'auto', objectFit: 'contain' }}
                        />
                    </div>
                    <div style={{ textAlign: 'right', lineHeight: 1.6 }}>
                        <p style={{ fontWeight: 700, fontSize: '13px', color: '#1e3a5f' }}>{supLegal}</p>
                        <p style={{ fontSize: '12px', color: '#1e3a5f' }}>{supPhone}</p>
                        <p style={{ fontSize: '12px', color: '#1e3a5f' }}>{supEmail}</p>
                    </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#111827', marginBottom: '12px' }}>{qNumber}</h2>
                    <div style={{ fontSize: '14px', color: '#000000', lineHeight: 2 }}>
                        <p><strong>Credit:</strong> {q.credit_available && q.credit_available !== '0' ? 'Yes' : 'No'}</p>
                        <p><strong>Submitted Date:</strong> {submittedAt}</p>
                        <p><strong>Currency:</strong> {currency}</p>
                        <p><strong>Delivery Time:</strong> {q.lead_time_days ? `${q.lead_time_days} Hours` : 'N/A'}</p>
                    </div>
                </div>

                <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px' }}>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                    }}>
                        <thead>
                            <tr>
                                <th style={thStyle()}>Product</th>
                                <th style={thStyle()}>Warranty</th>
                                <th style={thStyle()}>Discount</th>
                                <th style={thStyle()}>Qty</th>
                                <th style={thStyle()}>Unit Price ({currency})</th>
                                <th style={thStyle(true)}>Total Price ({currency})</th>
                            </tr>
                        </thead>
                        <tbody>
                            {q.items.length > 0 ? q.items.map((item) => {
                                const unitP = parseFloat(item.unit_price || '0');
                                const totP = parseFloat(item.total_price || '0');
                                const disc = item.discount || 0;
                                const warrantyText = item.warranty_available
                                    ? (item.warranty_details || '1 Year')
                                    : '—';
                                // const warrantyText = item.warranty_available
                                //     ? (item.warranty_duration || item.warranty_details || '1 Year')
                                //     : '—';
                                return (
                                    <tr key={item.id}>
                                        <td style={tdBase}>{item.product?.name || 'Product'}</td>
                                        <td style={tdBase}>{warrantyText}</td>
                                        <td style={tdBase}>{fmtNum(disc)}</td>
                                        <td style={{ ...tdBase, fontWeight: 700, color: '#000' }}>{item.quantity}</td>
                                        <td style={tdBase}>{fmtNum(unitP)}</td>
                                        <td style={{ ...tdBase, textAlign: 'right', fontWeight: 700, color: '#000' }}>{fmtNum(totP)}</td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan={6} style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' }}>
                                        No line items available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>


                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '28px' }}>
                    <div style={{ width: '320px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '14px', color: '#374151' }}>
                            <span>Sub Total</span>
                            <span>{fmtNum(subTotal > 0 ? subTotal : totalAmount)}</span>
                        </div>
                        {totalDiscount > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '14px', color: '#374151' }}>
                                <span>Discount</span>
                                <span>{fmtNum(totalDiscount)}</span>
                            </div>
                        )}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '12px 0 0',
                            fontSize: '20px',
                            fontWeight: 800,
                            borderTop: '2px solid #000',
                            marginTop: '8px',
                            color: '#000',
                        }}>
                            <span>Total</span>
                            <span>{fmtNum(totalAmount)}</span>
                        </div>
                    </div>
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <p style={{ fontSize: '15px', color: '#000', lineHeight: '1.5' }}>
                        <strong>Note:</strong> This proforma is valid for {q.proforma_validity_date ? `${Math.ceil((new Date(q.proforma_validity_date).getTime() - new Date(q.submitted_at || q.created_at).getTime()) / (1000 * 60 * 60 * 24))} days` : '30 days'}.
                    </p>
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <p style={{ fontSize: '15px', color: '#000', marginBottom: '4px' }}>
                        <strong style={{ textDecoration: 'underline' }}>Terms:</strong>
                    </p>
                    <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.6 }}>
                        {q.additional_terms || 'Lorem Ipsum is simply dummy text of the printing and type setting industry.'}
                    </p>
                </div>

            </div>

            <div style={{ borderTop: '1px solid #000', margin: '0 16mm 16px' }} />

            <div style={{
                margin: '0 16mm',
                padding: '0 0 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
            }}>
                <div style={{ fontSize: '13px', color: '#000', lineHeight: 1.6 }}>
                    <p><strong>Address:</strong> Kirkos, Sub City, Afework Building</p>
                    <p>5th Floor, Addis Ababa, Ethiopia</p>
                </div>
                <button
                    className="no-print"
                    onClick={onClose}
                    style={{
                        padding: '10px 40px',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#000',
                        background: '#ffffff',
                        border: '1px solid #000',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        marginTop: '-4px',
                    }}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export const QuotationDetailsModal = ({ isOpen, onClose, quotation }: QuotationDetailsModalProps) => {
    const overlayRef = useRef<HTMLDivElement>(null);
    const sheetRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => printElement(sheetRef.current);

    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen || !quotation) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === overlayRef.current) onClose();
    };

    return createPortal(<div
        ref={overlayRef}
        onClick={handleOverlayClick}
        style={{
            position: 'fixed', inset: 0, zIndex: 9999,
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
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#fff', background: 'rgba(255,255,255,0.12)', borderRadius: '999px', padding: '4px 14px', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)' }}>
                {quotation.quotation_number || 'Quotation Preview'}
            </span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {[{ icon: <Download size={15} />, label: 'Download', action: handlePrint },
                { icon: <Printer size={15} />, label: 'Print', action: handlePrint }].map(({ icon, label, action }) => (
                    <button key={label} onClick={action} title={label}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)', color: '#fff', cursor: 'pointer', backdropFilter: 'blur(8px)' }}>
                        {icon}
                    </button>
                ))}
                <div style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.2)', margin: '0 2px' }} />
                <button onClick={onClose} title="Close"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)', color: '#fff', cursor: 'pointer', backdropFilter: 'blur(8px)' }}>
                    <X size={15} />
                </button>
            </div>
        </div>

        <div ref={sheetRef} onClick={e => e.stopPropagation()}>
            <InvoiceSheet q={quotation} onClose={onClose} />
        </div>
    </div>,
        document.body
    );
};
