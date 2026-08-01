import { motion } from 'framer-motion';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const ConfirmDialog = ({ isOpen, onConfirm, onCancel, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative glass-card p-6 max-w-sm w-full mx-4"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-red-100 dark:bg-red-900/30">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title || 'Confirm Action'}</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-dark-muted mb-6">{message || 'Are you sure you want to proceed?'}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="btn-secondary" id="confirm-cancel-btn">Cancel</button>
          <button onClick={onConfirm} className="btn-danger" id="confirm-ok-btn">Delete</button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmDialog;
