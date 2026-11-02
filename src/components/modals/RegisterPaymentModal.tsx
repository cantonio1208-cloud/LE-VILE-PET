/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, DollarSign, Receipt, Printer, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PaymentMethod, Invoice } from '../../types';

export const RegisterPaymentModal: React.FC = () => {
  const {
    isRegisterPaymentOpen,
    closeRegisterPayment,
    paymentTargetInvoice,
    invoices,
    getClientById,
    getPetById,
    recordPayment,
  } = useApp();

  const [selectedInvoiceId, setSelectedInvoiceId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [method, setMethod] = useState<PaymentMethod>('PIX');
  const [isReceiptView, setIsReceiptView] = useState(false);
  const [lastPaymentDetails, setLastPaymentDetails] = useState<{
    invoice: Invoice;
    amountPaidNow: number;
    receiptNumber: string;
  } | null>(null);

  const pendingInvoices = invoices.filter(
    (inv) => inv.status === 'Pendente' || inv.status === 'Parcial' || inv.status === 'Vencido'
  );

  useEffect(() => {
    if (isRegisterPaymentOpen) {
      setIsReceiptView(false);
      setLastPaymentDetails(null);
      if (paymentTargetInvoice) {
        setSelectedInvoiceId(paymentTargetInvoice.id);
        setPaymentAmount(paymentTargetInvoice.balanceDue);
        setMethod(paymentTargetInvoice.paymentMethod || 'PIX');
      } else if (pendingInvoices.length > 0) {
        setSelectedInvoiceId(pendingInvoices[0].id);
        setPaymentAmount(pendingInvoices[0].balanceDue);
        setMethod(pendingInvoices[0].paymentMethod || 'PIX');
      }
    }
  }, [isRegisterPaymentOpen, paymentTargetInvoice]);

  const currentInvoice = invoices.find((i) => i.id === selectedInvoiceId);
  const client = currentInvoice ? getClientById(currentInvoice.clientId) : undefined;
  const pet = currentInvoice ? getPetById(currentInvoice.petId) : undefined;

  const handleInvoiceSelect = (id: string) => {
    setSelectedInvoiceId(id);
    const target = invoices.find((i) => i.id === id);
    if (target) {
      setPaymentAmount(target.balanceDue);
      setMethod(target.paymentMethod);
    }
  };

  if (!isRegisterPaymentOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInvoice || paymentAmount <= 0) return;

    recordPayment(currentInvoice.id, paymentAmount, method);

    setLastPaymentDetails({
      invoice: currentInvoice,
      amountPaidNow: paymentAmount,
      receiptNumber: currentInvoice.receiptNumber || `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    });
    setIsReceiptView(true);
  };

  const balanceAfter = currentInvoice ? Math.max(0, currentInvoice.balanceDue - paymentAmount) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-[#E9E9E6] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E9E9E6] px-6 py-4 bg-[#FBFBFA]">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">
              Módulo Financeiro
            </span>
            <h2 className="text-lg font-bold text-[#101010]">
              {isReceiptView ? 'Comprovante de Pagamento' : 'Registrar Pagamento'}
            </h2>
          </div>
          <button
            onClick={closeRegisterPayment}
            className="rounded-lg p-1.5 text-[#777777] hover:bg-[#E9E9E6] hover:text-[#101010] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isReceiptView && lastPaymentDetails ? (
          /* Receipt Screen */
          <div className="p-6 space-y-4">
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F0FDF4] text-[#15803D] mb-3 border border-[#BBF7D0]">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold text-[#101010]">Pagamento Efetuado com Sucesso</h3>
              <p className="text-xs text-[#777777]">
                Recibo gerado para a conta de {client?.name}
              </p>
            </div>

            <div className="rounded-xl border border-[#E9E9E6] bg-[#F9F9F8] p-4 text-xs space-y-2.5 font-mono">
              <div className="flex justify-between border-b border-[#E9E9E6] pb-2">
                <span className="text-[#777777]">Nº Recibo:</span>
                <span className="font-bold text-[#101010]">{lastPaymentDetails.receiptNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777777]">Cliente:</span>
                <span className="font-semibold text-[#101010]">{client?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777777]">Pet:</span>
                <span className="text-[#101010]">{pet?.name} ({pet?.breed})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777777]">Serviço:</span>
                <span className="text-[#101010] text-right truncate max-w-[200px]">
                  {lastPaymentDetails.invoice.serviceTitle}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777777]">Forma Utilizada:</span>
                <span className="font-bold text-[#101010]">{method}</span>
              </div>
              <div className="flex justify-between border-t border-[#E9E9E6] pt-2 text-sm">
                <span className="font-bold text-[#101010]">Valor Pago Agora:</span>
                <span className="font-bold text-[#15803D]">
                  R$ {lastPaymentDetails.amountPaidNow.toFixed(2)}
                </span>
              </div>
              {balanceAfter > 0 ? (
                <div className="flex justify-between text-xs text-[#B45309]">
                  <span>Saldo Restante Pendente:</span>
                  <span className="font-bold">R$ {balanceAfter.toFixed(2)}</span>
                </div>
              ) : (
                <div className="flex justify-between text-xs text-[#15803D]">
                  <span>Situação:</span>
                  <span className="font-bold">QUITADO INTEGRALMENTE</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 rounded-lg border border-[#E9E9E6] px-3 py-2 text-xs font-semibold text-[#555555] hover:bg-[#F6F6F4]"
              >
                <Printer className="h-4 w-4" />
                <span>Imprimir Recibo</span>
              </button>

              <button
                type="button"
                onClick={closeRegisterPayment}
                className="rounded-lg bg-[#FFC400] px-5 py-2 text-xs font-bold text-[#101010] hover:bg-[#E5B000]"
              >
                Concluir e Fechar
              </button>
            </div>
          </div>
        ) : (
          /* Payment Input Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Invoice Select */}
            <div>
              <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                Selecione a Conta / Fatura em Aberto *
              </label>
              {pendingInvoices.length === 0 ? (
                <div className="p-4 rounded-lg bg-[#F0FDF4] text-xs text-[#15803D] border border-[#BBF7D0]">
                  Parabéns! Todas as contas do pet shop estão quitadas no momento.
                </div>
              ) : (
                <select
                  value={selectedInvoiceId}
                  onChange={(e) => handleInvoiceSelect(e.target.value)}
                  className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-xs text-[#222222] focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
                >
                  {pendingInvoices.map((inv) => {
                    const c = getClientById(inv.clientId);
                    const p = getPetById(inv.petId);
                    return (
                      <option key={inv.id} value={inv.id}>
                        {c?.name} · {p?.name} - {inv.serviceTitle} (Falta R${' '}
                        {inv.balanceDue.toFixed(2)})
                      </option>
                    );
                  })}
                </select>
              )}
            </div>

            {currentInvoice && (
              <>
                {/* Account Summary Card */}
                <div className="rounded-xl bg-[#F6F6F4] p-4 border border-[#E9E9E6] space-y-2 text-xs">
                  <div className="flex justify-between items-center text-[#555555]">
                    <span>Cliente: <strong className="text-[#101010]">{client?.name}</strong></span>
                    <span>Pet: <strong className="text-[#101010]">{pet?.name}</strong></span>
                  </div>
                  <div className="flex justify-between items-center text-[#555555]">
                    <span>Total do Serviço:</span>
                    <span className="font-mono font-medium text-[#101010]">
                      R$ {currentInvoice.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[#555555]">
                    <span>Já Quitado:</span>
                    <span className="font-mono text-[#15803D]">
                      R$ {currentInvoice.amountPaid.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-[#E9E9E6]">
                    <span className="font-bold text-[#101010]">Saldo Restante a Pagar:</span>
                    <span className="font-mono font-extrabold text-sm text-[#DC2626]">
                      R$ {currentInvoice.balanceDue.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Amount to Pay */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                      Valor a Pagar Agora (R$) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      max={currentInvoice.balanceDue}
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(Number(e.target.value))}
                      required
                      className="w-full rounded-lg border border-[#E9E9E6] bg-white px-3 py-2 text-sm font-bold font-mono text-[#101010] focus:border-[#FFC400] focus:outline-hidden"
                    />
                    <div className="mt-1 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentAmount(currentInvoice.balanceDue)}
                        className="text-[11px] text-[#777777] underline hover:text-[#101010]"
                      >
                        Pagar Valor Total
                      </button>
                      {currentInvoice.balanceDue > 50 && (
                        <button
                          type="button"
                          onClick={() => setPaymentAmount(Number((currentInvoice.balanceDue / 2).toFixed(2)))}
                          className="text-[11px] text-[#777777] underline hover:text-[#101010]"
                        >
                          Pagar 50%
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                      Método de Pagamento *
                    </label>
                    <select
                      value={method}
                      onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                      className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-xs text-[#222222] focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
                    >
                      <option value="PIX">PIX (Chave Le Ville Pet)</option>
                      <option value="Cartão de crédito">Cartão de Crédito</option>
                      <option value="Cartão de débito">Cartão de Débito</option>
                      <option value="Dinheiro">Dinheiro em Espécie</option>
                      <option value="Transferência">TED / Transferência</option>
                    </select>
                  </div>
                </div>

                {/* Balance preview */}
                {paymentAmount < currentInvoice.balanceDue && (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] text-xs text-[#B45309]">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>
                      Pagamento parcial: restará <strong>R$ {balanceAfter.toFixed(2)}</strong> a receber.
                    </span>
                  </div>
                )}

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E9E9E6]">
                  <button
                    type="button"
                    onClick={closeRegisterPayment}
                    className="rounded-lg px-4 py-2 text-xs font-medium text-[#555555] hover:bg-[#F6F6F4]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-[#15803D] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#166534] active:scale-98 transition-all"
                  >
                    Confirmar Recebimento (R$ {paymentAmount.toFixed(2)})
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
