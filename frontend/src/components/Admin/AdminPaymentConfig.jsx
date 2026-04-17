import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getPaymentConfigAdmin, updatePaymentConfig } from '../../services/api';
import AdminImageUpload from './AdminImageUpload';
import { AdminInput, AdminTextarea } from './Shared/AdminFormControls';

const AdminPaymentConfig = () => {
  const [config, setConfig] = useState({
    bankName: '',
    accountNumber: '',
    accountHolder: '',
    qrImage: '',
    transferNote: 'BAKING {orderCode}',
    webhookSecret: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  useEffect(() => {
    getPaymentConfigAdmin()
      .then(data => {
        if (data) {
          setConfig({
            bankName: data.bankName || '',
            accountNumber: data.accountNumber || '',
            accountHolder: data.accountHolder || '',
            qrImage: data.qrImage || '',
            transferNote: data.transferNote || 'BAKING {orderCode}',
            webhookSecret: data.webhookSecret || ''
          });
        }
      })
      .catch(err => console.error('Failed to load payment config', err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!config.bankName || !config.accountNumber || !config.accountHolder) {
      toast.error('Bank name, account number, and account holder are required.');
      return;
    }
    setSaving(true);
    try {
      await updatePaymentConfig(config);
      toast.success('Payment configuration saved!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const generateSecret = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'whsec_';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setConfig({ ...config, webhookSecret: result });
  };

  if (loading) return <div className="text-center p-5"><div className="spinner-border"></div></div>;

  return (
    <div>
      <div className="admin-content-header">
        <h2>Payment Configuration</h2>
        <p style={{ color: '#88929e' }}>Configure bank transfer and QR code payment settings</p>
      </div>

      <form onSubmit={handleSave}>
        <div className="row">
          {/* Left: Config Form */}
          <div className="col-lg-7">
            <div className="admin-paper p-4 mb-4">
              <h5 className="mb-4" style={{ borderBottom: '1px solid var(--admin-border-light)', paddingBottom: '10px' }}>
                <i className="fa fa-university mr-2"></i> Bank Details
              </h5>
              
              <AdminInput 
                label={<>Bank Name <span className="text-danger">*</span></>}
                name="bankName"
                value={config.bankName}
                onChange={handleChange}
                placeholder="e.g. Chase Bank, Bank of America..."
                required
              />

              <div className="row mt-3">
                <div className="col-md-6">
                  <AdminInput 
                    label={<>Account Number <span className="text-danger">*</span></>}
                    name="accountNumber"
                    value={config.accountNumber}
                    onChange={handleChange}
                    placeholder="1234567890"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <AdminInput 
                    label={<>Account Holder <span className="text-danger">*</span></>}
                    name="accountHolder"
                    value={config.accountHolder}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div className="mt-3">
                <AdminInput 
                  label="Transfer Memo Template"
                  name="transferNote"
                  value={config.transferNote}
                  onChange={handleChange}
                  placeholder="BAKING {orderCode}"
                />
                <small style={{ color: '#88929e' }}>
                  Use <code>{'{orderCode}'}</code> as placeholder. It will be replaced with the actual order code.
                </small>
              </div>
            </div>

            <div className="admin-paper p-4 mb-4">
              <h5 className="mb-4" style={{ borderBottom: '1px solid var(--admin-border-light)', paddingBottom: '10px' }}>
                <i className="fa fa-qrcode mr-2"></i> QR Code Image
              </h5>
              <AdminImageUpload 
                label="Upload QR Code" 
                name="qrImage" 
                value={config.qrImage} 
                onChange={(url) => setConfig({ ...config, qrImage: url })} 
              />
            </div>

            <div className="admin-paper p-4 mb-4">
              <h5 className="mb-4" style={{ borderBottom: '1px solid var(--admin-border-light)', paddingBottom: '10px' }}>
                <i className="fa fa-cog mr-2"></i> Webhook Settings
              </h5>
              <p style={{ color: '#88929e', fontSize: '13px' }}>
                Configure a webhook secret to enable auto-confirmation of payments from your bank or payment provider.
              </p>
              
              <div className="d-flex align-items-end" style={{ gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <AdminInput 
                    label="Webhook Secret"
                    name="webhookSecret"
                    type={showSecret ? 'text' : 'password'}
                    value={config.webhookSecret}
                    onChange={handleChange}
                    placeholder="Enter or generate a webhook secret..."
                  />
                </div>
                <button 
                  type="button" 
                  className="btn btn-outline-secondary btn-sm mb-2"
                  onClick={() => setShowSecret(!showSecret)}
                  style={{ minWidth: '40px' }}
                >
                  <i className={`fa ${showSecret ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline-info btn-sm mb-2"
                  onClick={generateSecret}
                >
                  <i className="fa fa-refresh mr-1"></i> Generate
                </button>
              </div>
              
              <div className="alert alert-warning small mt-3 mb-0">
                <i className="fa fa-exclamation-triangle mr-1"></i>
                Webhook endpoint: <code>POST /api/webhook/payment</code>
                <br />
                Payload: <code>{'{ amount, content, transactionId, secret }'}</code>
              </div>
            </div>
          </div>

          {/* Right: Preview */}
          <div className="col-lg-5">
            <div className="admin-paper p-4" style={{ position: 'sticky', top: '20px' }}>
              <h5 className="mb-4" style={{ borderBottom: '1px solid var(--admin-border-light)', paddingBottom: '10px' }}>
                <i className="fa fa-eye mr-2"></i> Checkout Preview
              </h5>
              <div className="text-center mb-3">
                {config.qrImage ? (
                  <img 
                    src={config.qrImage.startsWith('http') ? config.qrImage : `${window.location.origin}${config.qrImage}`}
                    alt="QR Preview"
                    style={{ maxWidth: '220px', width: '100%', borderRadius: '12px', border: '2px solid var(--admin-border-light)' }}
                  />
                ) : (
                  <div className="p-4" style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '2px dashed var(--admin-border-light)' }}>
                    <i className="fa fa-qrcode" style={{ fontSize: '48px', color: '#555' }}></i>
                    <p style={{ color: '#888', marginTop: '8px', marginBottom: 0 }}>No QR uploaded</p>
                  </div>
                )}
              </div>
              <div className="mb-2">
                <small style={{ color: '#88929e' }}>Bank</small>
                <div style={{ fontWeight: '600' }}>{config.bankName || '—'}</div>
              </div>
              <div className="mb-2">
                <small style={{ color: '#88929e' }}>Account Number</small>
                <div style={{ fontWeight: '600' }}>{config.accountNumber || '—'}</div>
              </div>
              <div className="mb-2">
                <small style={{ color: '#88929e' }}>Account Holder</small>
                <div style={{ fontWeight: '600' }}>{config.accountHolder || '—'}</div>
              </div>
              <div className="mb-0">
                <small style={{ color: '#88929e' }}>Transfer Memo</small>
                <div><code>{(config.transferNote || 'BAKING {orderCode}').replace('{orderCode}', 'ORD-20260415-A1B2')}</code></div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-4 mb-5">
          <button type="submit" className="admin-btn-save px-5" disabled={saving}>
            {saving ? (
              <><span className="spinner-border spinner-border-sm mr-2"></span> Saving...</>
            ) : (
              <><i className="fa fa-save mr-2"></i> Save Configuration</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPaymentConfig;
