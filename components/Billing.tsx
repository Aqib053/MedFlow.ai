
import React, { useState } from 'react';
import { CreditCard, DollarSign, FileText, CheckCircle, Clock, Search, Download, ChevronRight, Plus, X, User, Calendar, AlertTriangle } from 'lucide-react';

export const Billing: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [invoices, setInvoices] = useState([
     { id: '#INV-2024-001', name: 'Rajesh Kumar', service: 'ER Consultation', date: 'Oct 24, 2024', amount: '450.00', status: 'Paid' },
     { id: '#INV-2024-002', name: 'Anjali Sharma', service: 'MRI Scan (Brain)', date: 'Oct 24, 2024', amount: '1,200.00', status: 'Pending' },
     { id: '#INV-2024-003', name: 'Priya Patel', service: 'Blood Panel', date: 'Oct 23, 2024', amount: '120.00', status: 'Paid' },
     { id: '#INV-2024-004', name: 'Arjun Singh', service: 'X-Ray (Wrist)', date: 'Oct 23, 2024', amount: '210.00', status: 'Overdue' },
  ]);

  const [newInvoice, setNewInvoice] = useState({
      name: '',
      service: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
  });

  const handleSaveInvoice = (e: React.FormEvent) => {
      e.preventDefault();
      const invoice = {
          id: `#INV-2024-00${invoices.length + 5}`,
          name: newInvoice.name,
          service: newInvoice.service,
          date: new Date(newInvoice.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          amount: parseFloat(newInvoice.amount).toFixed(2),
          status: 'Pending'
      };
      
      setInvoices([invoice, ...invoices]);
      setIsCreating(false);
      setNewInvoice({ name: '', service: '', amount: '', date: '', notes: '' });
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex flex-col relative">
       <div className="flex justify-between items-center mb-6">
        <div>
           <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Billing & Insurance</h2>
           <p className="text-slate-500 dark:text-slate-400">Manage invoices, claims, and revenue.</p>
        </div>
        <button 
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-sm transition-colors flex items-center gap-2"
        >
            <FileText size={18} /> Create Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20">
              <p className="text-blue-100 font-medium mb-1">Total Revenue (Today)</p>
              <h3 className="text-4xl font-bold mb-4">₹12,450</h3>
              <div className="flex items-center gap-2 text-sm bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-sm">
                  <CheckCircle size={14} /> 18 Invoices Paid
              </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
               <div className="flex justify-between items-start mb-4">
                   <div>
                       <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Pending Claims</p>
                       <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">₹4,200</h3>
                   </div>
                   <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl">
                       <Clock size={24} />
                   </div>
               </div>
               <p className="text-sm text-slate-500 dark:text-slate-400">6 claims awaiting insurance approval</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
               <div className="flex justify-between items-start mb-4">
                   <div>
                       <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Overdue Invoices</p>
                       <h3 className="text-3xl font-bold text-red-600 dark:text-red-400 mt-1">₹850</h3>
                   </div>
                   <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl">
                       <AlertTriangle size={24} />
                   </div>
               </div>
               <p className="text-sm text-slate-500 dark:text-slate-400">2 invoices overdue &gt; 30 days</p>
          </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
             <h3 className="font-bold text-slate-800 dark:text-white">Recent Transactions</h3>
             <div className="relative w-64">
                 <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                 <input type="text" placeholder="Search invoice or patient..." className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white" />
             </div>
         </div>

         <div className="overflow-y-auto flex-1 p-4">
             <table className="w-full text-left border-collapse">
                 <thead>
                     <tr className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase border-b border-slate-200 dark:border-slate-700">
                         <th className="py-3 pl-2">Invoice ID</th>
                         <th className="py-3">Patient</th>
                         <th className="py-3">Service</th>
                         <th className="py-3">Date</th>
                         <th className="py-3">Amount</th>
                         <th className="py-3">Status</th>
                         <th className="py-3 text-right pr-2">Action</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
                     {invoices.map(inv => (
                         <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                             <td className="py-3 pl-2 font-mono text-slate-500 dark:text-slate-400">{inv.id}</td>
                             <td className="py-3 font-bold text-slate-900 dark:text-white">{inv.name}</td>
                             <td className="py-3 text-slate-600 dark:text-slate-300">{inv.service}</td>
                             <td className="py-3 text-slate-500 dark:text-slate-400">{inv.date}</td>
                             <td className="py-3 font-medium text-slate-800 dark:text-slate-200">₹{inv.amount}</td>
                             <td className="py-3">
                                 <span className={`px-2.5 py-1 rounded-full text-xs font-bold
                                     ${inv.status === 'Paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                       inv.status === 'Pending' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                       'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}
                                 `}>
                                     {inv.status}
                                 </span>
                             </td>
                             <td className="py-3 text-right pr-2">
                                 <button className="text-slate-400 hover:text-blue-600 transition-colors">
                                     <Download size={18} />
                                 </button>
                             </td>
                         </tr>
                     ))}
                 </tbody>
             </table>
         </div>
      </div>

      {/* Create Invoice Modal */}
      {isCreating && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
              <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-slide-up">
                  <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">Generate New Invoice</h3>
                      <button onClick={() => setIsCreating(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                          <X size={20} className="text-slate-500" />
                      </button>
                  </div>
                  
                  <form onSubmit={handleSaveInvoice} className="p-6 space-y-4">
                      <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Patient Name</label>
                          <div className="relative">
                              <User className="absolute left-3 top-2.5 text-slate-400" size={18} />
                              <input 
                                required
                                type="text" 
                                placeholder="Search or enter patient name" 
                                value={newInvoice.name}
                                onChange={(e) => setNewInvoice({...newInvoice, name: e.target.value})}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                              />
                          </div>
                      </div>

                      <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Service Description</label>
                          <input 
                            required
                            type="text" 
                            placeholder="e.g. General Consultation, Blood Test" 
                            value={newInvoice.service}
                            onChange={(e) => setNewInvoice({...newInvoice, service: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                          />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Amount (₹)</label>
                              <div className="relative">
                                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₹</span>
                                  <input 
                                    required
                                    type="number" 
                                    placeholder="0.00" 
                                    value={newInvoice.amount}
                                    onChange={(e) => setNewInvoice({...newInvoice, amount: e.target.value})}
                                    className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                  />
                              </div>
                          </div>
                          <div className="space-y-2">
                              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Invoice Date</label>
                              <div className="relative">
                                  <Calendar className="absolute left-3 top-2.5 text-slate-400" size={18} />
                                  <input 
                                    type="date" 
                                    value={newInvoice.date}
                                    onChange={(e) => setNewInvoice({...newInvoice, date: e.target.value})}
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                  />
                              </div>
                          </div>
                      </div>

                      <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Notes (Optional)</label>
                          <textarea 
                             rows={3}
                             value={newInvoice.notes}
                             onChange={(e) => setNewInvoice({...newInvoice, notes: e.target.value})}
                             className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white resize-none"
                             placeholder="Insurance details, specific codes..."
                          />
                      </div>

                      <div className="pt-4 flex gap-3">
                          <button 
                            type="button" 
                            onClick={() => setIsCreating(false)}
                            className="flex-1 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                          >
                              Cancel
                          </button>
                          <button 
                            type="submit"
                            className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-colors"
                          >
                              Generate Invoice
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};
