import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { PlusIcon, CubeIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { useForm } from 'react-hook-form';

const InventoryPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  const { register, handleSubmit, reset } = useForm();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/inventory');
      setItems(res.data.data);
    } catch (e) {
      toast.error('Failed to fetch inventory items');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    api.get('/departments?limit=100').then(r => setDepartments(r.data.data)).catch(() => {});
  }, [fetchData]);

  const openCreate = () => {
    reset({ item_name: '', category: 'Lab Equipment', quantity: 10, unit_price: 5000, department_id: departments[0]?.department_id || '' });
    setModalOpen(true);
  };

  const onSubmit = async (formData) => {
    try {
      await api.post('/inventory', formData);
      toast.success('Inventory item added successfully');
      setModalOpen(false);
      fetchData();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to add item');
    }
  };

  const columns = [
    { key: 'item_name', label: 'Item Name', sortable: true },
    { key: 'category', label: 'Category' },
    { key: 'department', label: 'Department', render: (r) => r.department?.department_name || 'General Campus' },
    { key: 'quantity', label: 'Stock Quantity', render: (r) => <strong className="text-white">{r.quantity} Units</strong> },
    { key: 'unit_price', label: 'Unit Cost (₹)', render: (r) => `₹${parseFloat(r.unit_price).toLocaleString()}` },
    { key: 'status', label: 'Status', render: (r) => <span className={r.status === 'In Stock' ? 'badge-success' : 'badge-warning'}>{r.status}</span> }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Procurement & Lab Inventory</h1>
          <p className="page-subtitle">Track department equipment, lab hardware, stock levels, and procurement items</p>
        </div>
        <button onClick={openCreate} className="btn-primary" id="add-inventory-btn">
          <PlusIcon className="w-5 h-5" /> Add Procurement Item
        </button>
      </div>

      <DataTable columns={columns} data={items} loading={loading} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Procurement / Lab Item">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div><label className="form-label">Item Name</label><input className="form-input" {...register('item_name', { required: 'Required' })} /></div>
          <div><label className="form-label">Category</label><input className="form-input" {...register('category', { required: 'Required' })} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="form-label">Quantity</label><input type="number" className="form-input" {...register('quantity', { required: 'Required' })} /></div>
            <div><label className="form-label">Unit Price (₹)</label><input type="number" className="form-input" {...register('unit_price', { required: 'Required' })} /></div>
          </div>
          <div>
            <label className="form-label">Department</label>
            <select className="form-input" {...register('department_id')}>
              <option value="">General Campus</option>
              {departments.map(d => (
                <option key={d.department_id} value={d.department_id}>{d.department_name}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Add Item</button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default InventoryPage;
