import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useState } from 'react';
import GlassCard from '../common/GlassCard';
import API from '../../api';
import { toast } from 'react-toastify';

const UploadModal = ({ isOpen, onClose, onUploaded }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        department: '',
        complianceType: '',
        expiryDate: '',
        description: ''
    });

    const onDrop = (acceptedFiles) => {
        const selectedFile = acceptedFiles[0];
        setFile(selectedFile);
        if (selectedFile && !formData.name) {
            setFormData(prev => ({ ...prev, name: selectedFile.name }));
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: {
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'image/*': ['.png', '.jpg', '.jpeg']
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return toast.error('Please select a file');
        if (!formData.name || !formData.department || !formData.complianceType) {
            return toast.error('Please fill in all required fields');
        }

        setLoading(true);
        const data = new FormData();
        data.append('file', file);
        data.append('name', formData.name);
        data.append('department', formData.department);
        data.append('complianceType', formData.complianceType);
        data.append('expiryDate', formData.expiryDate);
        data.append('description', formData.description);

        try {
            await API.post('/documents', data);
            toast.success('Document uploaded successfully');
            if (onUploaded) onUploaded();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Upload failed');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="w-full max-w-2xl my-8"
                >
                    <GlassCard className="relative !p-8">
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <h2 className="text-2xl font-bold text-white mb-2">Upload Documents</h2>
                        <p className="text-slate-400 mb-8">Submit compliance files to the vault</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div
                                {...getRootProps()}
                                className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer
                    ${isDragActive ? 'border-primary-500 bg-primary-500/10' : 'border-slate-700 hover:border-slate-500 bg-slate-800/20'}`}
                            >
                                <input {...getInputProps()} />
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
                                        <Upload className="w-6 h-6 text-primary-500" />
                                    </div>
                                    {isDragActive ? (
                                        <p className="text-primary-400 font-medium">Drop the file here...</p>
                                    ) : (
                                        <div className="space-y-1">
                                            <p className="text-white font-medium">{file ? file.name : 'Click or drag file to upload'}</p>
                                            <p className="text-slate-500 text-xs">PDF, Word, or Images up to 50MB</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Document Name*</label>
                                    <input
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-primary-500"
                                        placeholder="e.g. Audit Report 2024"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Department*</label>
                                    <select
                                        required
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-primary-500"
                                    >
                                        <option value="">Select Department</option>
                                        <option>IT</option>
                                        <option>Legal</option>
                                        <option>HR</option>
                                        <option>Finance</option>
                                        <option>Operations</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Compliance Type*</label>
                                    <input
                                        required
                                        value={formData.complianceType}
                                        onChange={(e) => setFormData({ ...formData, complianceType: e.target.value })}
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-primary-500"
                                        placeholder="e.g. Certificate, Policy"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Expiry Date</label>
                                    <input
                                        type="date"
                                        value={formData.expiryDate}
                                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-primary-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-primary-500 h-20 resize-none"
                                    placeholder="Add any additional context..."
                                />
                            </div>

                            <div className="flex space-x-4 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-300 font-medium hover:bg-slate-800 transition-all font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 btn-premium py-3 font-semibold disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Upload & Submit'}
                                </button>
                            </div>
                        </form>
                    </GlassCard>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default UploadModal;
