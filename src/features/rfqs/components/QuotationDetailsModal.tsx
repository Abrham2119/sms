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
    @media print { body { margin: 0; } }
    /* Tailwind utility classes used by status badge */
    .bg-blue-50   { background-color: #eff6ff !important; }
    .text-blue-700 { color: #1d4ed8 !important; }
    .border-blue-200 { border-color: #bfdbfe !important; }
    .bg-green-50  { background-color: #f0fdf4 !important; }
    .text-green-700 { color: #15803d !important; }
    .border-green-200 { border-color: #bbf7d0 !important; }
    .bg-red-50    { background-color: #fff1f2 !important; }
    .text-red-700 { color: #b91c1c !important; }
    .border-red-200 { border-color: #fecaca !important; }
    .bg-amber-50  { background-color: #fffbeb !important; }
    .text-amber-700 { color: #b45309 !important; }
    .border-amber-200 { border-color: #fde68a !important; }
    .bg-emerald-50 { background-color: #ecfdf5 !important; }
    .text-emerald-700 { color: #047857 !important; }
    .border-emerald-200 { border-color: #a7f3d0 !important; }
    .bg-gray-100  { background-color: #f3f4f6 !important; }
    .text-gray-600 { color: #4b5563 !important; }
    .border-gray-200 { border-color: #e5e7eb !important; }
    /* badge shape */
    .px-2 { padding-left: 0.5rem !important; padding-right: 0.5rem !important; }
    .py-0\.5 { padding-top: 0.125rem !important; padding-bottom: 0.125rem !important; }
    .rounded-full { border-radius: 9999px !important; }
    .font-bold { font-weight: 700 !important; }
    .capitalize { text-transform: capitalize !important; }
    .border { border-width: 1px !important; border-style: solid !important; }
  </style>
</head>
<body>${el.outerHTML}</body>
</html>`);
    win.document.close();
    win.onload = () => { win.focus(); win.print(); win.close(); };
};

/* ─────────────────────────────────────────────
   Props (unchanged from call-site)
───────────────────────────────────────────── */
interface QuotationDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    quotation: Quotation | null;
}

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const fmt = (value: string | number, currency = 'ETB') => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return `${currency} 0.00`;
    return `${currency} ${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const fmtDate = (dateStr?: string | null, fallback = 'N/A') => {
    if (!dateStr) return fallback;
    try {
        return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(dateStr));
    } catch {
        return fallback;
    }
};

const statusColors: Record<string, string> = {
    submitted: 'bg-blue-50 text-blue-700 border border-blue-200',
    accepted: 'bg-green-50 text-green-700 border border-green-200',
    rejected: 'bg-red-50 text-red-700 border border-red-200',
    shortlisted: 'bg-amber-50 text-amber-700 border border-amber-200',
    awarded: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
};

/* ─────────────────────────────────────────────
   Droga brand logo mark
───────────────────────────────────────────── */
/* Official Droga Consulting letterhead header */
interface DrogaHeaderProps {
    supLegal: string;
    phone?: string;
    supEmail?: string;
}
const DrogaHeader = ({ supLegal, phone, supEmail }: DrogaHeaderProps) => (
    <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '10px',
        borderBottom: '3px solid #cc0000',
        marginBottom: '20px',
    }}>
        {/* Left: Logo */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
                src="/assets/logo/Droga logo 1.svg"
                alt="Droga Consulting Logo"
                style={{ height: 'auto', width: 'auto', objectFit: 'contain', flexShrink: 0 }}
            />
        </div>
        {/* Right: Supplier info */}
        <div style={{ textAlign: 'right', color: '#000000', lineHeight: 1.8 }}>
            <p style={{ fontWeight: 600, color: '#000000', fontSize: '12px' }}>{supLegal}</p>
            <p style={{ fontSize: '11px', fontWeight: 400 }}>{phone}</p>
            {supEmail && (
                <p style={{ fontSize: '11px', fontWeight: 400 }}>{supEmail}</p>
            )}
        </div>
    </div>
);

/* ─────────────────────────────────────────────
   A4 invoice sheet
───────────────────────────────────────────── */
const InvoiceSheet = ({ q }: { q: Quotation }) => {
    const currency = q.currency || 'ETB';
    const qNumber = q.quotation_number || 'Q-2025-0001';
    const submittedAt = fmtDate(q.submitted_at, 'Feb 27, 2026');
    const validUntil = fmtDate(q.proforma_validity_date, 'Mar 27, 2026');

    const totalAmount = parseFloat(q.total_amount) || 0;
    const itemsTotal = q.items.reduce((s, i) => s + parseFloat(i.total_price || '0'), 0);
    const totalDiscount = q.items.reduce((s, i) => s + (i.discount || 0), 0);
    const subTotal = itemsTotal + totalDiscount;
    const creditAmt = q.credit_amount || 0;

    const supLegal = q.supplier?.legal_name || 'Acme Technologies Ltd.';
    const supPhone = q.supplier?.phone || '';
    const supEmail = q.supplier?.email || '';

    const statusClass = statusColors[q.status?.toLowerCase()] ?? 'bg-gray-100 text-gray-600 border border-gray-200';

    return (
        <div style={{
            width: '210mm',
            minHeight: '297mm',
            padding: '14mm 16mm',
            background: '#ffffff',
            fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
            fontSize: '11.5px',
            lineHeight: '1.5',
            boxShadow: '0 8px 40px rgba(0,0,0,0.22)',
            borderRadius: '3px',
            position: 'relative',
        }}>

            {/* ── 1. HEADER (Droga Letterhead) ──────────── */}
            <DrogaHeader supLegal={supLegal} phone={supPhone} supEmail={supEmail} />

            {/* ── QUOTATION META ────────────────────────── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '22px' }}>
                <div />
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#0f172a', letterSpacing: '-1px', lineHeight: 1, marginBottom: '10px' }}>QUOTATION</h1>
                    {[['Quotation #', qNumber], ['Date', submittedAt], ['Valid Until', validUntil]].map(([label, value]) => (
                        <div key={label} style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', marginBottom: '4px' }}>
                            <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, color: '#94a3b8' }}>{label}</span>
                            <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#111827', minWidth: '120px', textAlign: 'right' }}>{value}</span>
                        </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', marginTop: '6px', alignItems: 'center' }}>
                        <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, color: '#94a3b8' }}>Status</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold capitalize ${statusClass}`}>{q.status}</span>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div style={{ borderTop: '1px solid #e2e8f0', marginBottom: '18px' }} />

            {/* ── 2. PARTIES ────────────────────────────── */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '22px' }}>
                <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '8.5px', textTransform: 'uppercase', letterSpacing: '0.09em', fontWeight: 800, color: '#94a3b8', marginBottom: '6px' }}>Supplied By</p>
                    <p style={{ fontWeight: 800, fontSize: '12.5px', color: '#0f172a', lineHeight: 1.3 }}>{supLegal}</p>
                    {/* {supTrade && supTrade !== supLegal && <p style={{ fontSize: '11px', color: '#6b7280', fontWeight: 500 }}>{supTrade}</p>} */}
                    <p style={{ fontSize: '10px', color: '#9ca3af', marginTop: '3px' }}>{supEmail}</p>
                </div>
                <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '8.5px', textTransform: 'uppercase', letterSpacing: '0.09em', fontWeight: 800, color: '#94a3b8', marginBottom: '6px' }}>Bill To</p>
                    <p style={{ fontWeight: 800, fontSize: '12.5px', color: '#0f172a', lineHeight: 1.3 }}>Droga Consulting Services PLC</p>
                    <p style={{ fontSize: '11px', color: '#6b7280', fontWeight: 500 }}>Procurement Department</p>
                    <p style={{ fontSize: '10px', color: '#9ca3af', marginTop: '3px' }}>Kirkos Sub-City, Afework Building<br />Addis Ababa, Ethiopia</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontSize: '8.5px', textTransform: 'uppercase', letterSpacing: '0.09em', fontWeight: 800, color: '#94a3b8', marginBottom: '6px' }}>Details</p>
                    {[
                        ['Currency', currency],
                        ['Lead Time', q.lead_time_days ? `${q.lead_time_days} days` : 'N/A'],
                        ['Delivery', q.delivery_method || 'FOB'],
                        ['Min. Qty', q.minimum_order_quantity || '1'],
                    ].map(([label, value]) => (
                        <div key={label} style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', marginBottom: '3px', fontSize: '10px' }}>
                            <span style={{ color: '#9ca3af' }}>{label}</span>
                            <span style={{ fontWeight: 700, color: '#111827' }}>{value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── 3. LINE ITEMS TABLE ──────────────────── */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10.5px' }}>
                <thead>
                    <tr style={{ background: '#f1f5f9', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                        {[['#', 'left'], ['Description', 'left'], ['Qty', 'right'], ['Unit Price', 'right'], ['Discount', 'right'], ['Total', 'right']].map(([h, align]) => (
                            <th key={h} style={{ padding: '8px 9px', textAlign: align as 'left' | 'right', fontSize: '8.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#94a3b8' }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {q.items.length > 0 ? q.items.map((item, idx) => {
                        const unitP = parseFloat(item.unit_price || '0');
                        const totP = parseFloat(item.total_price || '0');
                        const disc = item.discount || 0;
                        return (
                            <tr key={item.id} style={{ background: idx % 2 === 1 ? '#fafafa' : '#fff', borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '8px 9px', color: '#cbd5e1', fontWeight: 600, width: '22px' }}>{idx + 1}</td>
                                <td style={{ padding: '8px 9px' }}>
                                    <p style={{ fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>{item.product?.name || 'Product'}</p>
                                    {item.product?.description && <p style={{ fontSize: '9px', color: '#94a3b8', marginTop: '2px' }}>{item.product.description.slice(0, 75)}{item.product.description.length > 75 ? '…' : ''}</p>}
                                    {item.warranty_available && <p style={{ fontSize: '9px', color: '#64748b', marginTop: '2px' }}>Warranty: {item.warranty_duration || item.warranty_details || '1 Year'}</p>}
                                </td>
                                <td style={{ padding: '8px 9px', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>{item.quantity}</td>
                                <td style={{ padding: '8px 9px', textAlign: 'right', color: '#475569', fontVariantNumeric: 'tabular-nums' }}>{unitP.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td style={{ padding: '8px 9px', textAlign: 'right', color: disc > 0 ? '#dc2626' : '#cbd5e1', fontVariantNumeric: 'tabular-nums' }}>
                                    {disc > 0 ? `(${disc.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})` : '—'}
                                </td>
                                <td style={{ padding: '8px 9px', textAlign: 'right', fontWeight: 800, color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>
                                    {totP.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                            </tr>
                        );
                    }) : (
                        <tr><td colSpan={6} style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' }}>No line items available</td></tr>
                    )}
                </tbody>
            </table>

            {/* ── 4. TOTALS ──────────────────────────────── */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '18px', marginBottom: '22px' }}>
                <div style={{ width: '230px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #f1f5f9', fontSize: '11px' }}>
                        <span style={{ color: '#6b7280', fontWeight: 500 }}>Subtotal</span>
                        <span style={{ fontWeight: 700, color: '#111827', fontVariantNumeric: 'tabular-nums' }}>{fmt(subTotal > 0 ? subTotal : totalAmount, currency)}</span>
                    </div>
                    {totalDiscount > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #f1f5f9', fontSize: '11px' }}>
                            <span style={{ color: '#6b7280', fontWeight: 500 }}>Total Discount</span>
                            <span style={{ fontWeight: 700, color: '#dc2626', fontVariantNumeric: 'tabular-nums' }}>({fmt(totalDiscount, currency)})</span>
                        </div>
                    )}
                    {q.credit_available === '1' && creditAmt > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #f1f5f9', fontSize: '11px' }}>
                            <span style={{ color: '#6b7280', fontWeight: 500 }}>Credit ({q.credit_period_days ?? '—'} days)</span>
                            <span style={{ fontWeight: 700, color: '#2563eb', fontVariantNumeric: 'tabular-nums' }}>{fmt(creditAmt, currency)}</span>
                        </div>
                    )}
                    <div style={{ background: '#0f172a', borderRadius: '8px', padding: '10px 14px', marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8' }}>Grand Total</span>
                        <span style={{ fontSize: '17px', fontWeight: 900, color: '#facc15', letterSpacing: '-0.5px', fontVariantNumeric: 'tabular-nums' }}>{fmt(totalAmount, currency)}</span>
                    </div>
                </div>
            </div>

            {/* ── 5. TERMS / NOTES ───────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '18px' }}>
                <div>
                    <p style={{ fontSize: '8.5px', textTransform: 'uppercase', letterSpacing: '0.09em', fontWeight: 800, color: '#94a3b8', marginBottom: '5px' }}>Terms &amp; Conditions</p>
                    <p style={{ fontSize: '10px', color: '#6b7280', lineHeight: 1.6 }}>
                        {q.additional_terms || 'Payment is due within 30 days of invoice date. All prices are inclusive of applicable taxes unless otherwise stated. This quotation is valid for the period specified above.'}
                    </p>
                </div>
                <div>
                    <p style={{ fontSize: '8.5px', textTransform: 'uppercase', letterSpacing: '0.09em', fontWeight: 800, color: '#94a3b8', marginBottom: '5px' }}>Supplier Notes</p>
                    <p style={{ fontSize: '10px', color: '#6b7280', lineHeight: 1.6 }}>
                        {q.notes || 'Prices valid for the duration specified. Availability subject to stock confirmation at time of order.'}
                    </p>
                    {q.warranty_details && <p style={{ fontSize: '10px', color: '#6b7280', marginTop: '5px', lineHeight: 1.6 }}><strong style={{ color: '#374151' }}>Warranty:</strong> {q.warranty_details}</p>}
                </div>
            </div>

            {/* Thank-you */}
            <div style={{ textAlign: 'center', padding: '10px 0', borderTop: '1px dashed #e5e7eb', borderBottom: '1px dashed #e5e7eb', marginBottom: '18px' }}>
                <p style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af' }}>Thank you for your business — We appreciate your trust.</p>
            </div>

            {/* ── 6. FOOTER ──────────────────────────────── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '9px', color: '#9ca3af' }}>
                <div style={{ lineHeight: 1.65 }}>
                    <p style={{ fontWeight: 700, color: '#6b7280' }}>Droga Consulting Services PLC</p>
                    <p>Kirkos Sub-City · Afework Building · Addis Ababa, Ethiopia</p>
                    <p>Reg. No: 000/TIN/2023 · info@drogaconsulting.com</p>
                </div>
                <p style={{ fontWeight: 600 }}>Page 1 of 1</p>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────
   Main Export — custom full-screen overlay
   using createPortal (no reusable Modal)
───────────────────────────────────────────── */
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

    return createPortal(
        /* Dark blurred backdrop */
        <div
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
            {/* Floating toolbar */}
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

            {/* A4 sheet — centered horizontally, scrollable vertically */}
            <div ref={sheetRef} onClick={e => e.stopPropagation()}>
                <InvoiceSheet q={quotation} />
            </div>
        </div>,
        document.body
    );
};
