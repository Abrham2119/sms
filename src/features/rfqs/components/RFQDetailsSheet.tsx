import React from 'react';
import type { RFQ } from '../../../types/rfq';

const fmtDate = (dateStr?: string | null, fallback = 'N/A') => {
    if (!dateStr) return fallback;
    try {
        return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(dateStr));
    } catch {
        return fallback;
    }
};

interface RFQDetailsSheetProps {
    rfq: RFQ;
    onClose: () => void;
}

export const RFQDetailsSheet = ({ rfq, onClose }: RFQDetailsSheetProps) => {
    const refNumber = rfq.reference_number || 'RFQ-2025-0001';
    const submissionDeadline = fmtDate(rfq.submission_deadline);
    const location = rfq.delivery_location || 'N/A';

    const supLegal = 'Droga Pharma PLC';
    const supPhone = '+251 900 110 011';
    const supEmail = 'Info@drogapharma.com';

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
                {/* 1. HEADER */}
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
                            src="/assets/logo/droga-logo-main-1024x246.png.svg"
                            alt="Droga Pharma Logo"
                            style={{ height: '70px', width: 'auto', objectFit: 'contain' }}
                        />
                    </div>
                    <div style={{ textAlign: 'right', lineHeight: 1.6 }}>
                        <p style={{ fontWeight: 700, fontSize: '13px', color: '#111827' }}>{supLegal}</p>
                        <p style={{ fontSize: '12px', color: '#111827' }}>{supPhone}</p>
                        <p style={{ fontSize: '12px', color: '#111827' }}>{supEmail}</p>
                    </div>
                </div>

                {/* 2. RFQ META */}
                <div style={{ marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#111827', marginBottom: '12px' }}>{refNumber}</h2>
                    <div style={{ fontSize: '14px', color: '#000000', lineHeight: 2 }}>
                        <p><strong>Submission Date:</strong> {submissionDeadline}</p>
                        <p><strong>Delivery Location:</strong> {location}</p>
                    </div>
                </div>

                {/* 3. PRODUCTS TABLE */}
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px' }}>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                    }}>
                        <thead>
                            <tr>
                                <th style={thStyle()}>Product</th>
                                <th style={thStyle()}>Category</th>
                                <th style={thStyle()}>Qty</th>
                                <th style={thStyle(true)}>Specifications</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rfq.products && rfq.products.length > 0 ? rfq.products.map((item, idx) => {
                                return (
                                    <tr key={idx}>
                                        <td style={tdBase}>{item.name}</td>
                                        <td style={tdBase}>ID: {item.category_id.substring(0, 8)}</td>
                                        <td style={{ ...tdBase, fontWeight: 700, color: '#000' }}>{item.pivot.quantity}</td>
                                        <td style={{ ...tdBase, color: '#94a3b8', fontStyle: 'italic', fontSize: '12px' }}>
                                            {item.pivot.specifications || 'Curabitur at ex'}
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan={4} style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' }}>
                                        No products requested
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 4. DESCRIPTION */}
                <div style={{ marginBottom: '20px' }}>
                    <p style={{ fontSize: '15px', color: '#000', fontWeight: 700, marginBottom: '8px' }}>
                        Description:
                    </p>
                    <div style={{ fontSize: '14px', color: '#374151', lineHeight: 1.6 }}>
                        {rfq.description ? (
                            <div style={{ whiteSpace: 'pre-wrap' }}>{rfq.description}</div>
                        ) : (
                            <p>No description provided.</p>
                        )}
                    </div>
                </div>
            </div>

            <div style={{ borderTop: '1px solid #000', margin: '0 16mm 16px' }} />

            {/* 5. FOOTER */}
            <div style={{
                margin: '0 16mm',
                padding: '0 0 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
            }}>
                <div style={{ fontSize: '13px', color: '#000', lineHeight: 1.6 }}>
                    <p><strong>Address:</strong> Gullele, Woreda 09, Near St. Rufael Church</p>
                    <p>Droga Tower, Addis Ababa, Ethiopia</p>
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
