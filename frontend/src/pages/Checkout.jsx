import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import PageTitle from '../components/Shared/PageTitle';
import { getProgramBySlug, getPaymentConfig, createOrder, getOrderById, submitOrderProof, cancelOrder, uploadImage, createVnpayPaymentUrl } from '../services/api';
import { formatPrice, getOrderStatusBadge } from '../utils/formatters';
import { ROUTES } from '../constants/routes';
import { useTranslation } from '../i18n/LanguageContext';

const STEPS = {
  SUMMARY: 1,
  METHOD: 2,
  PAYMENT: 3,
  STATUS: 4
};

const Checkout = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session');
  const { t } = useTranslation();

  const [program, setProgram] = useState(null);
  const [paymentConfig, setPaymentConfig] = useState(null);
  const [order, setOrder] = useState(null);
  const [step, setStep] = useState(STEPS.SUMMARY);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('VNPAY'); // 'VNPAY' | 'MANUAL_BANK'

  // Proof form
  const [proofImage, setProofImage] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const [prog, config] = await Promise.all([
          getProgramBySlug(slug),
          getPaymentConfig().catch(() => null)
        ]);
        setProgram(prog);
        setPaymentConfig(config);

        // If already purchased, redirect to program detail
        if (prog.hasPurchased) {
          toast.info(t('checkout.toast.orderCreated') || 'You already own this course!');
          navigate(ROUTES.PROGRAM_DETAIL(slug));
          return;
        }

        // Check if there's an existing active order
        if (prog.orderStatus === 'PENDING' || prog.orderStatus === 'AWAITING_CONFIRM' || prog.orderStatus === 'REJECTED') {
          // Re-create order to get full details
          const orderRes = await createOrder({ programId: prog.id, classSessionId: sessionId });
          setOrder(orderRes.order);
          
          if (prog.orderStatus === 'AWAITING_CONFIRM') {
            setStep(STEPS.STATUS);
          } else if (prog.orderStatus === 'REJECTED') {
            setStep(STEPS.PAYMENT);
            setPaymentMethod('MANUAL_BANK');
          } else {
            setStep(STEPS.METHOD);
          }
        }
      } catch (err) {
        console.error('Checkout init error:', err);
        toast.error(t('checkout.toast.orderCreateFailed') || 'Failed to load checkout information.');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [slug, navigate, t]);

  const handleCreateOrder = async () => {
    setSubmitting(true);
    try {
      const res = await createOrder({ programId: program.id, classSessionId: sessionId });
      setOrder(res.order);
      setStep(STEPS.METHOD);
      toast.success(t('checkout.toast.orderCreated'));
    } catch (err) {
      toast.error(err.response?.data?.error || t('checkout.toast.orderCreateFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleVnpayPayment = async () => {
    if (!order) return;
    setSubmitting(true);
    try {
      const res = await createVnpayPaymentUrl(order.id);
      // Redirect to VNPay payment page
      window.location.href = res.paymentUrl;
    } catch (err) {
      toast.error(err.response?.data?.error || t('checkout.toast.vnpayFailed'));
      setSubmitting(false);
    }
  };

  const handleSelectMethod = (method) => {
    setPaymentMethod(method);
    if (method === 'VNPAY') {
      handleVnpayPayment();
    } else {
      setStep(STEPS.PAYMENT);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadImage(file);
      setProofImage(res.url);
      toast.success('Image uploaded successfully.');
    } catch (err) {
      toast.error('Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitProof = async (e) => {
    e.preventDefault();
    if (!proofImage && !transactionRef) {
      toast.error(t('checkout.transfer.memoWarning') || 'Please provide a proof image or transaction reference.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await submitOrderProof(order.id, { proofImage, transactionRef });
      setOrder(res.order);
      setStep(STEPS.STATUS);
      toast.success(t('checkout.toast.proofSubmitted'));
    } catch (err) {
      toast.error(err.response?.data?.error || t('checkout.toast.proofFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await cancelOrder(order.id);
      toast.info(t('checkout.toast.orderCancelled'));
      navigate(ROUTES.PROGRAM_DETAIL(slug));
    } catch (err) {
      toast.error(t('checkout.toast.cancelFailed') || 'Failed to cancel order.');
    }
  };

  const handleCopyMemo = () => {
    navigator.clipboard.writeText(order?.transferContent || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefreshStatus = async () => {
    if (!order) return;
    try {
      const updated = await getOrderById(order.id);
      setOrder(updated);
      if (updated.status === 'CONFIRMED') {
        toast.success(t('checkout.toast.paymentConfirmed'));
        setStep(STEPS.STATUS);
      } else if (updated.status === 'REJECTED') {
        toast.warn(t('checkout.toast.paymentRejected'));
        setStep(STEPS.PAYMENT);
        setPaymentMethod('MANUAL_BANK');
      }
    } catch (err) {
      console.error('refresh error', err);
    }
  };

  if (loading) {
    return (
      <div className="text-center" style={{ padding: '150px 0' }}>
        <h2>{t('checkout.loading')}</h2>
        <div className="spinner-border" role="status"></div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="text-center" style={{ padding: '150px 0' }}>
        <h2>{t('checkout.notFound')}</h2>
      </div>
    );
  }

  const statusBadge = order ? getOrderStatusBadge(order.status) : null;
  const stepLabels = [
    { num: 1, label: t('checkout.steps.summary') },
    { num: 2, label: t('checkout.steps.method') },
    { num: 3, label: t('checkout.steps.payment') },
    { num: 4, label: t('checkout.steps.status') }
  ];

  return (
    <>
      <PageTitle 
        title={t('checkout.pageTitle') || 'Thanh Toán'}
        breadcrumbs={[
          { label: t('header.home') || 'Trang Chủ', link: '/' },
          { label: t('header.programs') || 'Khóa Học', link: ROUTES.PROGRAM },
          { label: program.title, link: ROUTES.PROGRAM_DETAIL(slug) },
          { label: t('checkout.pageTitle') || 'Thanh Toán' }
        ]}
      />

      <section className="ls s-py-60 s-py-lg-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">

              {/* Progress Steps */}
              <div className="checkout-steps d-flex justify-content-center mb-5">
                {stepLabels.map(s => (
                  <div key={s.num} className={`checkout-step ${step >= s.num ? 'active' : ''} ${step === s.num ? 'current' : ''}`}>
                    <div className="step-number">{s.num}</div>
                    <div className="step-label">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* STEP 1: Order Summary */}
              {step === STEPS.SUMMARY && (
                <div className="checkout-card bordered p-4 p-lg-5">
                  <h4 className="mb-4"><i className="fa fa-shopping-cart color-main mr-2"></i> {t('checkout.orderSummary')}</h4>
                  
                  <div className="d-flex align-items-start mb-4" style={{ gap: '20px' }}>
                    {program.thumbnail && (
                      <img 
                        src={program.thumbnail.startsWith('http') ? program.thumbnail : `${import.meta.env.BASE_URL}${program.thumbnail.replace(/^\//, '')}`} 
                        alt={program.title} 
                        style={{ width: '120px', height: '90px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    )}
                    <div>
                      <h5 className="mb-1">{program.title}</h5>
                      {program.chief && <p className="small-text color-main mb-1">{t('programDetail.instructor') || 'Giảng viên'}: {program.chief.name}</p>}
                      <p className="text-muted small mb-0">{program.description?.substring(0, 120)}...</p>
                    </div>
                  </div>

                  <div className="divider-15"></div>

                  <div className="d-flex justify-content-between align-items-center p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                    <span style={{ fontSize: '18px', fontWeight: '600' }}>{t('checkout.total')}</span>
                    <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--colorMain)' }}>
                      {formatPrice(program.price)}
                    </span>
                  </div>

                  <div className="divider-30"></div>

                  <div className="text-center">
                    <button 
                      className="btn btn-maincolor btn-lg px-5" 
                      onClick={handleCreateOrder} 
                      disabled={submitting}
                    >
                      {submitting ? (
                        <><span className="spinner-border spinner-border-sm mr-2"></span> Processing...</>
                      ) : (
                        <><i className="fa fa-lock mr-2"></i> {t('checkout.proceedToPayment')}</>
                      )}
                    </button>
                    <p className="text-muted small mt-3">
                      <i className="fa fa-shield mr-1"></i> Secure payment via VNPay or bank transfer
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 2: Payment Method */}
              {step === STEPS.METHOD && order && (
                <div className="checkout-card bordered p-4 p-lg-5">
                  <h4 className="mb-4"><i className="fa fa-credit-card color-main mr-2"></i> {t('checkout.selectMethod')}</h4>
                  
                  <div className="row" style={{ gap: '0' }}>
                    {/* VNPay Option */}
                    <div className="col-md-6 mb-3">
                      <div 
                        className={`payment-method-card ${paymentMethod === 'VNPAY' ? 'selected' : ''}`}
                        onClick={() => !submitting && setPaymentMethod('VNPAY')}
                        style={{
                          border: paymentMethod === 'VNPAY' ? '2px solid var(--colorMain, #c19a5b)' : '2px solid #e0e0e0',
                          borderRadius: '12px',
                          padding: '24px',
                          cursor: submitting ? 'wait' : 'pointer',
                          transition: 'all 0.3s ease',
                          backgroundColor: paymentMethod === 'VNPAY' ? 'rgba(193,154,91,0.05)' : '#fff',
                          height: '100%',
                        }}
                      >
                        <div className="text-center">
                          <div style={{ fontSize: '36px', marginBottom: '12px' }}>💳</div>
                          <h5 className="mb-2">{t('checkout.vnpay.title')}</h5>
                          <span className="badge bg-success text-white mb-2" style={{ fontSize: '10px' }}>{t('checkout.vnpay.badge')}</span>
                          <p className="text-muted small mb-0">
                            {t('checkout.vnpay.description')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Manual Transfer Option */}
                    <div className="col-md-6 mb-3">
                      <div 
                        className={`payment-method-card ${paymentMethod === 'MANUAL_BANK' ? 'selected' : ''}`}
                        onClick={() => !submitting && setPaymentMethod('MANUAL_BANK')}
                        style={{
                          border: paymentMethod === 'MANUAL_BANK' ? '2px solid var(--colorMain, #c19a5b)' : '2px solid #e0e0e0',
                          borderRadius: '12px',
                          padding: '24px',
                          cursor: submitting ? 'wait' : 'pointer',
                          transition: 'all 0.3s ease',
                          backgroundColor: paymentMethod === 'MANUAL_BANK' ? 'rgba(193,154,91,0.05)' : '#fff',
                          height: '100%',
                        }}
                      >
                        <div className="text-center">
                          <div style={{ fontSize: '36px', marginBottom: '12px' }}>🏦</div>
                          <h5 className="mb-2">{t('checkout.manual.title')}</h5>
                          <span className="badge bg-secondary text-white mb-2" style={{ fontSize: '10px' }}>Manual</span>
                          <p className="text-muted small mb-0">
                            {t('checkout.manual.description')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order info summary */}
                  <div className="p-3 mt-3 mb-4" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                    <div className="d-flex justify-content-between mb-1">
                      <span>Order:</span>
                      <strong>{order.orderCode}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>{t('checkout.total')}:</span>
                      <strong style={{ color: 'var(--colorMain)', fontSize: '18px' }}>{formatPrice(order.amount)}</strong>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between">
                    <button type="button" className="btn btn-outline-secondary" onClick={handleCancel}>
                      <i className="fa fa-times mr-1"></i> {t('checkout.cancelOrder')}
                    </button>
                    <button 
                      className="btn btn-maincolor btn-lg px-4" 
                      onClick={() => handleSelectMethod(paymentMethod)}
                      disabled={submitting}
                    >
                      {submitting ? (
                        <><span className="spinner-border spinner-border-sm mr-2"></span> Processing...</>
                      ) : paymentMethod === 'VNPAY' ? (
                        <><i className="fa fa-external-link mr-2"></i> Pay with VNPay</>
                      ) : (
                        <><i className="fa fa-arrow-right mr-2"></i> {t('checkout.continueWith', { method: t('checkout.manual.title') })}</>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Payment (Manual Bank Transfer) */}
              {step === STEPS.PAYMENT && order && (
                <div className="checkout-card bordered p-4 p-lg-5">
                  <h4 className="mb-4"><i className="fa fa-qrcode color-main mr-2"></i> {t('checkout.steps.payment')}</h4>
                  
                  {order.status === 'REJECTED' && (
                    <div className="alert alert-danger mb-4">
                      <strong><i className="fa fa-exclamation-triangle mr-2"></i>Payment Rejected</strong>
                      <p className="mb-0 mt-2">{order.adminNote || 'Your previous payment was rejected. Please re-upload your proof.'}</p>
                    </div>
                  )}

                  {/* Order Info */}
                  <div className="p-3 mb-4" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                    <div className="d-flex justify-content-between mb-2">
                      <span>{t('status.orderCode')}:</span>
                      <strong>{order.orderCode}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>{t('checkout.course')}:</span>
                      <strong>{order.program?.title}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>{t('checkout.total')}:</span>
                      <strong style={{ color: 'var(--colorMain)', fontSize: '20px' }}>{formatPrice(order.amount)}</strong>
                    </div>
                  </div>

                  {/* QR Code + Bank Info */}
                  {paymentConfig ? (
                    <div className="row">
                      <div className="col-md-6 text-center mb-4">
                        {paymentConfig.qrImage ? (
                          <img 
                            src={paymentConfig.qrImage.startsWith('http') ? paymentConfig.qrImage : `${import.meta.env.BASE_URL}${paymentConfig.qrImage.replace(/^\//, '')}`}
                            alt="Payment QR Code" 
                            style={{ maxWidth: '280px', width: '100%', borderRadius: '12px', border: '2px solid #e0e0e0' }}
                          />
                        ) : (
                          <div className="p-5 text-center" style={{ backgroundColor: '#f0f0f0', borderRadius: '12px' }}>
                            <i className="fa fa-qrcode" style={{ fontSize: '60px', color: '#ccc' }}></i>
                            <p className="text-muted mt-2">QR Code not available</p>
                          </div>
                        )}
                      </div>
                      <div className="col-md-6">
                        <h5 className="mb-3">{t('checkout.transfer.title')}</h5>
                        <div className="mb-2">
                          <small className="text-muted">{t('checkout.transfer.bankName')}</small>
                          <div style={{ fontWeight: '600' }}>{paymentConfig.bankName}</div>
                        </div>
                        <div className="mb-2">
                          <small className="text-muted">{t('checkout.transfer.accountNumber')}</small>
                          <div style={{ fontWeight: '600' }}>{paymentConfig.accountNumber}</div>
                        </div>
                        <div className="mb-2">
                          <small className="text-muted">{t('checkout.transfer.accountHolder')}</small>
                          <div style={{ fontWeight: '600' }}>{paymentConfig.accountHolder}</div>
                        </div>
                        <div className="mb-3">
                          <small className="text-muted">{t('checkout.transfer.memo')}</small>
                          <div className="d-flex align-items-center" style={{ gap: '8px' }}>
                            <code style={{ fontSize: '16px', fontWeight: '700', color: 'var(--colorMain)' }}>
                              {order.transferContent}
                            </code>
                            <button 
                              className="btn btn-sm btn-outline-dark" 
                              onClick={handleCopyMemo}
                              title="Copy to clipboard"
                            >
                              <i className={`fa ${copied ? 'fa-check' : 'fa-clipboard'}`}></i>
                            </button>
                          </div>
                        </div>
                        <div className="alert alert-warning small">
                          <i className="fa fa-info-circle mr-1"></i>
                          {t('checkout.transfer.memoWarning')}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="alert alert-info">
                      <i className="fa fa-info-circle mr-2"></i>
                      Payment configuration is not set up yet. Please contact support.
                    </div>
                  )}

                  <hr className="my-4" />

                  {/* Upload Proof */}
                  <h5 className="mb-3"><i className="fa fa-upload mr-2"></i> {t('checkout.transfer.proofTitle')}</h5>
                  
                  <form onSubmit={handleSubmitProof}>
                    <div className="mb-3">
                      <label className="fw-bold mb-2">{t('checkout.transfer.proofLabel')}</label>
                      <div className="d-flex align-items-center" style={{ gap: '12px' }}>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageUpload}
                          className="form-control"
                          disabled={uploading}
                        />
                        {uploading && <span className="spinner-border spinner-border-sm"></span>}
                      </div>
                      {proofImage && (
                        <div className="mt-2">
                          <img 
                            src={proofImage.startsWith('http') ? proofImage : `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '')}${proofImage}`}
                            alt="Proof" 
                            style={{ maxWidth: '200px', borderRadius: '8px', border: '1px solid #ddd' }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="fw-bold mb-2">{t('checkout.transfer.transactionRef')}</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={transactionRef}
                        onChange={e => setTransactionRef(e.target.value)}
                        placeholder={t('checkout.transfer.transactionRefPlaceholder')}
                      />
                    </div>

                    <div className="d-flex justify-content-between">
                      <button type="button" className="btn btn-outline-secondary" onClick={handleCancel}>
                        <i className="fa fa-times mr-1"></i> {t('checkout.cancelOrder')}
                      </button>
                      <button type="submit" className="btn btn-maincolor btn-lg px-4" disabled={submitting || (!proofImage && !transactionRef)}>
                        {submitting ? (
                          <><span className="spinner-border spinner-border-sm mr-2"></span> Submitting...</>
                        ) : (
                          <><i className="fa fa-paper-plane mr-2"></i> {t('checkout.transfer.submitProof')}</>
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Option to switch to VNPay */}
                  <div className="text-center mt-4 pt-3" style={{ borderTop: '1px solid #eee' }}>
                    <button 
                      className="btn btn-sm btn-outline-maincolor" 
                      onClick={handleVnpayPayment}
                      disabled={submitting}
                    >
                      <i className="fa fa-credit-card mr-1"></i> Switch to VNPay Payment
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Status */}
              {step === STEPS.STATUS && order && (
                <div className="checkout-card bordered p-4 p-lg-5 text-center">
                  {order.status === 'AWAITING_CONFIRM' && (
                    <>
                      <div className="mb-4">
                        <i className="fa fa-clock-o" style={{ fontSize: '60px', color: '#17a2b8' }}></i>
                      </div>
                      <h4 className="mb-3">Awaiting Confirmation</h4>
                      <p className="text-muted mb-4">
                        {t('checkout.status.awaitingMsg')}
                      </p>
                      <p className="mb-3">
                        <span className={`badge ${statusBadge?.className}`} style={{ fontSize: '14px', padding: '8px 16px' }}>
                          {statusBadge?.label}
                        </span>
                      </p>
                      <div className="d-flex justify-content-center" style={{ gap: '12px' }}>
                        <button className="btn btn-outline-dark" onClick={handleRefreshStatus}>
                          <i className="fa fa-refresh mr-1"></i> Check Status
                        </button>
                        <Link to={ROUTES.PROGRAM_DETAIL(slug)} className="btn btn-outline-maincolor">
                          <i className="fa fa-arrow-left mr-1"></i> {t('checkout.status.viewCourse')}
                        </Link>
                      </div>
                    </>
                  )}

                  {order.status === 'CONFIRMED' && (
                    <>
                      <div className="mb-4">
                        <i className="fa fa-check-circle" style={{ fontSize: '80px', color: '#28a745' }}></i>
                      </div>
                      <h3 className="mb-3" style={{ color: '#28a745' }}>🎉 Payment Confirmed!</h3>
                      <p className="text-muted mb-4">{t('checkout.status.confirmedMsg')}</p>
                      <Link to={ROUTES.PROGRAM_DETAIL(slug)} className="btn btn-maincolor btn-lg px-5">
                        <i className="fa fa-play-circle mr-2"></i> {t('checkout.status.viewCourse')}
                      </Link>
                    </>
                  )}

                  {order.status === 'REJECTED' && (
                    <>
                      <div className="mb-4">
                        <i className="fa fa-times-circle" style={{ fontSize: '60px', color: '#dc3545' }}></i>
                      </div>
                      <h4 className="mb-3" style={{ color: '#dc3545' }}>Payment Rejected</h4>
                      <p className="text-muted mb-2">
                        {order.adminNote || t('checkout.status.rejectedMsg')}
                      </p>
                      <button className="btn btn-maincolor mt-3" onClick={() => { setStep(STEPS.PAYMENT); setPaymentMethod('MANUAL_BANK'); }}>
                        <i className="fa fa-upload mr-1"></i> {t('checkout.status.reupload')}
                      </button>
                    </>
                  )}

                  {order.status === 'PENDING' && (
                    <>
                      <div className="mb-4">
                        <i className="fa fa-hourglass-half" style={{ fontSize: '60px', color: '#ffc107' }}></i>
                      </div>
                      <h4 className="mb-3">Payment Pending</h4>
                      <button className="btn btn-maincolor" onClick={() => setStep(STEPS.METHOD)}>
                        <i className="fa fa-arrow-right mr-1"></i> Go to Payment
                      </button>
                    </>
                  )}

                  <div className="mt-4 p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                    <small className="text-muted">
                      {t('checkout.status.orderCode')}: <strong>{order.orderCode}</strong> • 
                      {t('checkout.total')}: <strong>{formatPrice(order.amount)}</strong> • 
                      Created: <strong>{new Date(order.createdAt).toLocaleString()}</strong>
                      {order.paymentMethod && <> • Method: <strong>{order.paymentMethod === 'VNPAY' ? t('checkout.vnpay.title') : t('checkout.manual.title')}</strong></>}
                    </small>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      <style>{`
        .checkout-steps {
          gap: 0;
        }
        .checkout-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          flex: 1;
        }
        .checkout-step:not(:last-child)::after {
          content: '';
          position: absolute;
          top: 18px;
          left: 55%;
          width: 90%;
          height: 2px;
          background: #e0e0e0;
        }
        .checkout-step.active:not(:last-child)::after {
          background: var(--colorMain, #c19a5b);
        }
        .step-number {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
          background: #e0e0e0;
          color: #999;
          position: relative;
          z-index: 2;
          transition: all 0.3s ease;
        }
        .checkout-step.active .step-number {
          background: var(--colorMain, #c19a5b);
          color: #fff;
        }
        .checkout-step.current .step-number {
          box-shadow: 0 0 0 4px rgba(193, 154, 91, 0.25);
        }
        .step-label {
          font-size: 12px;
          margin-top: 6px;
          color: #999;
          font-weight: 500;
        }
        .checkout-step.active .step-label {
          color: #333;
          font-weight: 600;
        }
        .checkout-card {
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        }
        .payment-method-card:hover {
          border-color: var(--colorMain, #c19a5b) !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
      `}
      </style>
    </>
  );
};

export default Checkout;
