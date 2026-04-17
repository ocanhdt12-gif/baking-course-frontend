import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getAllOrders, confirmOrder, rejectOrder } from '../../services/api';
import { formatPrice, getOrderStatusBadge } from '../../utils/formatters';
import AdminTable from './AdminTable';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [processing, setProcessing] = useState(false);
  const [filter, setFilter] = useState('ALL');

  const fetchOrders = async () => {
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (err) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleConfirm = async () => {
    if (!selectedOrder) return;
    setProcessing(true);
    try {
      await confirmOrder(selectedOrder.id, adminNote);
      toast.success(`Order ${selectedOrder.orderCode} confirmed!`);
      setSelectedOrder(null);
      setAdminNote('');
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to confirm order');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedOrder) return;
    if (!adminNote.trim()) {
      toast.warn('Please provide a reason for rejection.');
      return;
    }
    setProcessing(true);
    try {
      await rejectOrder(selectedOrder.id, adminNote);
      toast.info(`Order ${selectedOrder.orderCode} rejected.`);
      setSelectedOrder(null);
      setAdminNote('');
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to reject order');
    } finally {
      setProcessing(false);
    }
  };

  const filteredOrders = filter === 'ALL' 
    ? orders 
    : orders.filter(o => o.status === filter);

  const statusCounts = {
    ALL: orders.length,
    PENDING: orders.filter(o => o.status === 'PENDING').length,
    AWAITING_CONFIRM: orders.filter(o => o.status === 'AWAITING_CONFIRM').length,
    CONFIRMED: orders.filter(o => o.status === 'CONFIRMED').length,
    REJECTED: orders.filter(o => o.status === 'REJECTED').length,
  };

  if (loading) return <div className="text-center p-5"><div className="spinner-border"></div></div>;

  return (
    <div>
      <div className="admin-content-header">
        <h2>Order Management</h2>
        <p style={{ color: '#88929e' }}>Review and manage payment orders</p>
      </div>

      {/* Filter Tabs */}
      <div className="d-flex mb-4" style={{ gap: '8px', flexWrap: 'wrap' }}>
        {Object.entries(statusCounts).map(([key, count]) => (
          <button
            key={key}
            className={`btn btn-sm ${filter === key ? 'btn-dark' : 'btn-outline-secondary'}`}
            onClick={() => setFilter(key)}
            style={{ borderRadius: '20px', padding: '6px 16px' }}
          >
            {key === 'ALL' ? 'All' : key.replace('_', ' ')} ({count})
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="admin-paper">
        <div className="table-responsive">
          <table className="table admin-table">
            <thead>
              <tr>
                <th>Order Code</th>
                <th>User</th>
                <th>Course</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Method</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr><td colSpan="8" className="text-center py-4" style={{ color: '#88929e' }}>No orders found</td></tr>
              ) : (
                filteredOrders.map(order => {
                  const badge = getOrderStatusBadge(order.status);
                  return (
                    <tr key={order.id}>
                      <td><code style={{ fontSize: '13px' }}>{order.orderCode}</code></td>
                      <td>
                        <div style={{ fontWeight: '600' }}>{order.user?.fullName}</div>
                        <small style={{ color: '#88929e' }}>{order.user?.email}</small>
                      </td>
                      <td>{order.program?.title}</td>
                      <td style={{ fontWeight: '600' }}>{formatPrice(order.amount)}</td>
                      <td>
                        <span className={`badge ${badge.className}`} style={{ fontSize: '11px' }}>
                          {badge.label}
                        </span>
                      </td>
                      <td>
                        {order.paymentMethod === 'VNPAY' ? (
                          <span className="badge bg-success text-white" style={{ fontSize: '10px' }}>VNPay</span>
                        ) : order.paidViaWebhook ? (
                          <span className="badge bg-info text-white" style={{ fontSize: '10px' }}>Webhook</span>
                        ) : order.proofImage ? (
                          <span className="badge bg-secondary text-white" style={{ fontSize: '10px' }}>Manual</span>
                        ) : (
                          <span style={{ color: '#aaa', fontSize: '12px' }}>—</span>
                        )}
                      </td>
                      <td><small>{new Date(order.createdAt).toLocaleDateString()}</small></td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-info rounded-pill"
                          onClick={() => { setSelectedOrder(order); setAdminNote(''); }}
                        >
                          <i className="fa fa-eye"></i> View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="admin-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '650px' }}>
            <div className="admin-modal-header">
              <h5>Order Details — {selectedOrder.orderCode}</h5>
              <button onClick={() => setSelectedOrder(null)} className="admin-modal-close">&times;</button>
            </div>
            <div className="admin-modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              {/* Order Info */}
              <div className="row mb-3">
                <div className="col-6">
                  <small style={{ color: '#88929e' }}>User</small>
                  <div style={{ fontWeight: '600' }}>{selectedOrder.user?.fullName}</div>
                  <small>{selectedOrder.user?.email}</small>
                </div>
                <div className="col-6">
                  <small style={{ color: '#88929e' }}>Course</small>
                  <div style={{ fontWeight: '600' }}>{selectedOrder.program?.title}</div>
                  <small>{formatPrice(selectedOrder.amount)}</small>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-6">
                  <small style={{ color: '#88929e' }}>Status</small>
                  <div>
                    <span className={`badge ${getOrderStatusBadge(selectedOrder.status).className}`}>
                      {getOrderStatusBadge(selectedOrder.status).label}
                    </span>
                  </div>
                </div>
                <div className="col-6">
                  <small style={{ color: '#88929e' }}>Transfer Memo</small>
                  <div><code>{selectedOrder.transferContent}</code></div>
                </div>
              </div>

              {/* Transaction Reference */}
              {selectedOrder.transactionRef && (
                <div className="mb-3">
                  <small style={{ color: '#88929e' }}>Transaction Reference</small>
                  <div style={{ fontWeight: '600' }}>{selectedOrder.transactionRef}</div>
                </div>
              )}

              {/* Proof Image */}
              {selectedOrder.proofImage && (
                <div className="mb-3">
                  <small style={{ color: '#88929e' }}>Payment Proof</small>
                  <div className="mt-1">
                    <img 
                      src={selectedOrder.proofImage.startsWith('http') ? selectedOrder.proofImage : `${window.location.origin}${selectedOrder.proofImage}`}
                      alt="Payment proof"
                      style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '8px', border: '1px solid #ddd', cursor: 'pointer' }}
                      onClick={() => window.open(selectedOrder.proofImage.startsWith('http') ? selectedOrder.proofImage : `${window.location.origin}${selectedOrder.proofImage}`, '_blank')}
                    />
                  </div>
                </div>
              )}

              {selectedOrder.paidViaWebhook && (
                <div className="alert alert-info small mb-3">
                  <i className="fa fa-bolt mr-1"></i> This order was auto-confirmed via {selectedOrder.paymentMethod === 'VNPAY' ? 'VNPay' : 'payment webhook'}.
                </div>
              )}

              {/* VNPay Gateway Info */}
              {selectedOrder.paymentMethod === 'VNPAY' && (
                <div className="mb-3 p-3" style={{ backgroundColor: 'rgba(40,167,69,0.05)', borderRadius: '8px', border: '1px solid rgba(40,167,69,0.15)' }}>
                  <small style={{ color: '#88929e', fontWeight: '600' }}>VNPay Gateway Info</small>
                  <div className="row mt-2" style={{ fontSize: '13px' }}>
                    <div className="col-6 mb-1">
                      <small style={{ color: '#88929e' }}>TxnRef</small>
                      <div><code>{selectedOrder.gatewayTxnRef || '—'}</code></div>
                    </div>
                    <div className="col-6 mb-1">
                      <small style={{ color: '#88929e' }}>Transaction No</small>
                      <div><code>{selectedOrder.gatewayTransactionNo || '—'}</code></div>
                    </div>
                    <div className="col-6 mb-1">
                      <small style={{ color: '#88929e' }}>Response Code</small>
                      <div><code>{selectedOrder.gatewayResponseCode || '—'}</code></div>
                    </div>
                    <div className="col-6 mb-1">
                      <small style={{ color: '#88929e' }}>Paid At</small>
                      <div>{selectedOrder.paidAt ? new Date(selectedOrder.paidAt).toLocaleString() : '—'}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Admin Actions — hidden for auto-confirmed VNPay orders */}
              {['PENDING', 'AWAITING_CONFIRM'].includes(selectedOrder.status) && (
                <>
                  <hr />
                  <div className="mb-3">
                    <label style={{ fontWeight: '600' }}>Admin Note</label>
                    <textarea
                      className="form-control mt-1"
                      rows="2"
                      value={adminNote}
                      onChange={e => setAdminNote(e.target.value)}
                      placeholder="Optional note (required for rejection)..."
                    />
                  </div>
                  <div className="d-flex justify-content-end" style={{ gap: '10px' }}>
                    <button
                      className="btn btn-danger px-4"
                      onClick={handleReject}
                      disabled={processing}
                    >
                      <i className="fa fa-times mr-1"></i> Reject
                    </button>
                    <button
                      className="btn btn-success px-4"
                      onClick={handleConfirm}
                      disabled={processing}
                    >
                      <i className="fa fa-check mr-1"></i> Confirm Payment
                    </button>
                  </div>
                </>
              )}

              {selectedOrder.adminNote && selectedOrder.status !== 'AWAITING_CONFIRM' && (
                <div className="mt-3 p-2" style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '6px' }}>
                  <small style={{ color: '#88929e' }}>Admin Note:</small>
                  <div>{selectedOrder.adminNote}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
