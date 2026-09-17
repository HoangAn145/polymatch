import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  UserRole, 
  UserAccount, 
  AssessmentResultData, 
  InvestmentPreferences, 
  TechListing, 
  LeadInquiry, 
  TechTaxonomyItem, 
  AssessmentQuestion, 
  MatchingWeights, 
  PillarId, 
  DbiLevelNumber,
  EnterpriseSize,
  WalletTransaction,
  PlatformPricingConfig
} from '../types';
import { 
  SAMPLE_USERS, 
  GUEST_USER,
  INITIAL_TECH_LISTINGS, 
  INITIAL_LEADS, 
  TECH_TAXONOMY, 
  SME_ASSESSMENT_QUESTIONS, 
  DEFAULT_MATCHING_WEIGHTS, 
  SAMPLE_ASSESSMENT_RESULT,
  DBI_LEVELS,
  DBI_PILLARS,
  DEFAULT_PLATFORM_PRICING,
  INITIAL_WALLET_TRANSACTIONS
} from '../data/mockData';
import { calculateDbiAssessment } from '../data/assessmentData';

interface AppContextType {
  currentRoute: string;
  currentPath: string; // alias
  navigate: (route: string) => void;
  currentUser: UserAccount;
  setCurrentUser: (user: UserAccount) => void;
  switchRole: (role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
  
  // Assessment state
  activeAssessmentId: string;
  setActiveAssessmentId: (id: string) => void;
  assessmentType: EnterpriseSize;
  setAssessmentType: (type: EnterpriseSize) => void;
  assessmentAnswers: Record<string, number>;
  saveAnswer: (questionId: string, optionIndex: number) => void;
  clearAssessmentDraft: () => void;
  submitAssessment: () => AssessmentResultData;
  currentResult: AssessmentResultData;
  setCurrentResult: (res: AssessmentResultData) => void;
  assessmentHistory: AssessmentResultData[];
  
  // Investment
  investmentPrefs: InvestmentPreferences;
  saveInvestmentPrefs: (prefs: Partial<InvestmentPreferences>) => void;
  
  // Marketplace & Listings
  techListings: TechListing[];
  addTechListing: (listing: Omit<TechListing, 'id' | 'createdAt' | 'views' | 'interestCount' | 'rating' | 'reviewCount'>) => void;
  addListing: (listing: any) => void;
  updateListingStatus: (listingId: string, status: 'approved' | 'rejected', reason?: string) => void;
  approveListing: (listingId: string) => void;
  rejectListing: (listingId: string, reason?: string) => void;
  toggleInterestTech: (tech: TechListing) => void;
  
  // Tech Comparison & Detail
  activeTechDetailId: string;
  setActiveTechDetailId: (id: string) => void;
  compareList: string[]; // tech IDs
  comparisonList: string[]; // alias
  toggleCompare: (techId: string) => void;
  addToCompare: (techId: string) => void;
  removeFromCompare: (techId: string) => void;
  clearCompare: () => void;
  
  // Leads & Messaging
  leads: LeadInquiry[];
  createLead: (leadData: any) => LeadInquiry;
  activeChatLeadId: string | null;
  setActiveChatLeadId: (id: string | null) => void;
  chatMessages: any[];
  sendChatMessage: (leadId: string, text: string) => void;
  updateLeadStatus: (leadId: string, status: LeadInquiry['status']) => void;

  // Thu phí Nền tảng: Phí mở Lead & Ví Vendor (Pay-per-Lead)
  platformPricing: PlatformPricingConfig;
  updatePlatformPricing: (config: Partial<PlatformPricingConfig>) => void;
  vendorWalletBalance: number;
  vendorTransactions: WalletTransaction[];
  topupVendorWallet: (amount: number) => void;
  unlockLead: (leadId: string) => { success: boolean; message: string; fee?: number };
  
  // Admin & Questions
  techCatalog: TechTaxonomyItem[];
  addTechCatalogItem: (item: TechTaxonomyItem) => void;
  addTaxonomyItem: (item: TechTaxonomyItem) => void;
  batchImportCatalog: (items: TechTaxonomyItem[]) => void;
  questions: AssessmentQuestion[];
  updateQuestionWeight: (questionId: string, weight: number) => void;
  matchingWeights: MatchingWeights;
  updateMatchingWeights: (weights: MatchingWeights) => boolean;
  
  // Vendors KYC & Approval
  vendorsList: UserAccount[];
  pendingVendors: any[];
  approveVendor: (userId: string) => void;
  rejectVendor: (userId: string, reason?: string) => void;
  updateVendorKyc: (userId: string, status: 'approved' | 'rejected', reason?: string) => void;
  
  // Users
  usersList: UserAccount[];
  toggleUserLock: (userId: string) => void;
  changeUserRole: (userId: string, newRole: UserRole) => void;

  // Demo helpers
  resetAllDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Route state (supports pushState and URL sync)
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return window.location.pathname.length > 1 ? window.location.pathname : '/';
  });

  const navigate = (route: string) => {
    setCurrentRoute(route);
    window.history.pushState({}, '', route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Current logged in user (Default to Buyer for immediate assessment & dashboard preview)
  const [currentUser, setCurrentUser] = useState<UserAccount>(() => {
    const saved = localStorage.getItem('dbi_current_user');
    return saved ? JSON.parse(saved) : SAMPLE_USERS[0];
  });

  useEffect(() => {
    localStorage.setItem('dbi_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  const switchRole = (role: UserRole) => {
    if (role === 'BUYER') {
      setCurrentUser(SAMPLE_USERS[0]);
      navigate('/dashboard');
    } else if (role === 'VENDOR') {
      setCurrentUser(SAMPLE_USERS[1]);
      navigate('/vendor');
    } else if (role === 'ADMIN') {
      setCurrentUser(SAMPLE_USERS[3]);
      navigate('/admin');
    } else {
      // Guest / Unauthenticated
      setCurrentUser(GUEST_USER);
      navigate('/');
    }
  };

  const logout = () => {
    setCurrentUser(GUEST_USER);
    navigate('/');
  };

  const isAuthenticated = currentUser.role !== 'GUEST' && currentUser.id !== 'USER-GUEST-01';

  // Assessment answers draft state
  const [activeAssessmentId, setActiveAssessmentId] = useState<string>('ASSESS-2026-001');
  const [assessmentType, setAssessmentTypeState] = useState<EnterpriseSize>(() => {
    const saved = localStorage.getItem('dbi_assessment_type');
    return (saved as EnterpriseSize) || currentUser.company.size || 'SME';
  });

  const setAssessmentType = (type: EnterpriseSize) => {
    setAssessmentTypeState(type);
    localStorage.setItem('dbi_assessment_type', type);
  };

  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('dbi_assessment_draft');
    return saved ? JSON.parse(saved) : {
      'Q01': 2, 'Q02': 1, 'Q03': 2, 'Q04': 1,
      'Q05': 2, 'Q06': 1, 'Q07': 2, 'Q08': 1,
      'Q09': 2, 'Q10': 1, 'Q11': 2, 'Q12': 1
    };
  });

  const saveAnswer = (questionId: string, optionIndex: number) => {
    setAssessmentAnswers(prev => {
      const next = { ...prev, [questionId]: optionIndex };
      localStorage.setItem('dbi_assessment_draft', JSON.stringify(next));
      return next;
    });
  };

  const clearAssessmentDraft = () => {
    setAssessmentAnswers({});
    localStorage.removeItem('dbi_assessment_draft');
  };

  // Result & History
  const [currentResult, setCurrentResult] = useState<AssessmentResultData>(() => {
    const saved = localStorage.getItem('dbi_current_result');
    return saved ? JSON.parse(saved) : SAMPLE_ASSESSMENT_RESULT;
  });

  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentResultData[]>([
    {
      ...SAMPLE_ASSESSMENT_RESULT,
      id: 'ASSESS-HIST-01',
      date: '2025-09-12',
      totalScore: 26,
      level: 2,
      levelTitle: 'Đang thử nghiệm / Bắt đầu kết nối'
    },
    SAMPLE_ASSESSMENT_RESULT
  ]);

  const submitAssessment = (): AssessmentResultData => {
    const newResult = calculateDbiAssessment({
      answers: assessmentAnswers,
      assessmentType,
      companyName: currentUser.company.companyName,
      industry: currentUser.company.industry,
      userId: currentUser.id
    });

    setCurrentResult(newResult);
    localStorage.setItem('dbi_current_result', JSON.stringify(newResult));
    setAssessmentHistory(prev => [newResult, ...prev]);
    return newResult;
  };

  // Investment Preferences
  const [investmentPrefs, setInvestmentPrefs] = useState<InvestmentPreferences>({
    budgetTier: 'MEDIUM',
    budgetText: '100 - 300 triệu VND',
    hrReadiness: 3,
    infraReadiness: 3,
    leadershipCommitment: 4,
    priorityPillars: ['OPERATIONS', 'DATA_SECURITY', 'CUSTOMER_EXPERIENCE'],
    timeline: 'Quý 2/2026'
  });

  const saveInvestmentPrefs = (prefs: Partial<InvestmentPreferences>) => {
    setInvestmentPrefs(prev => ({ ...prev, ...prefs }));
  };

  // Listings
  const [techListings, setTechListings] = useState<TechListing[]>(INITIAL_TECH_LISTINGS);

  const addTechListing = (newListing: Omit<TechListing, 'id' | 'createdAt' | 'views' | 'interestCount' | 'rating' | 'reviewCount'>) => {
    const listing: TechListing = {
      ...newListing,
      id: `LISTING-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      views: 0,
      interestCount: 0,
      rating: 5.0,
      reviewCount: 0
    };
    setTechListings(prev => [listing, ...prev]);
  };

  const updateListingStatus = (listingId: string, status: 'approved' | 'rejected', reason?: string) => {
    setTechListings(prev => prev.map(item => {
      if (item.id === listingId) {
        return {
          ...item,
          status,
          rejectionReason: status === 'rejected' ? (reason || 'Chưa đạt tiêu chuẩn kiểm duyệt') : undefined
        };
      }
      return item;
    }));
  };

  // Leads & Messaging
  const [leads, setLeads] = useState<LeadInquiry[]>(INITIAL_LEADS);
  const [activeChatLeadId, setActiveChatLeadId] = useState<string | null>(INITIAL_LEADS[0]?.id || null);

  const toggleInterestTech = (tech: TechListing) => {
    // Check if already interested
    const existing = leads.find(l => l.techListingId === tech.id && l.buyerId === currentUser.id);
    if (existing) {
      setActiveChatLeadId(existing.id);
      navigate('/interests');
      return;
    }

    // Create new lead inquiry
    const newLead: LeadInquiry = {
      id: `LEAD-${Date.now()}`,
      buyerId: currentUser.id,
      buyerName: currentUser.fullName,
      buyerCompany: currentUser.company.companyName,
      buyerIndustry: currentUser.company.industry,
      buyerEmployeeCount: currentUser.company.employeeCount,
      buyerDbiScore: currentResult.totalScore,
      buyerDbiLevel: currentResult.level,
      buyerBudget: investmentPrefs.budgetText,
      techListingId: tech.id,
      techName: tech.techName,
      vendorId: tech.vendorId,
      vendorName: tech.vendorName,
      status: 'new',
      createdAt: new Date().toLocaleString('vi-VN'),
      lastMessageAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      messages: [
        {
          id: `MSG-${Date.now()}-1`,
          sender: 'SYSTEM',
          senderName: 'Hệ thống DBI',
          text: `Doanh nghiệp ${currentUser.company.companyName} đã gửi thông tin quan tâm tới giải pháp ${tech.techName}.`,
          timestamp: 'Vừa xong'
        },
        {
          id: `MSG-${Date.now()}-2`,
          sender: 'BUYER',
          senderName: currentUser.fullName,
          text: `Xin chào ${tech.vendorName}, chúng tôi đang có nhu cầu tìm hiểu và nhận báo giá chi tiết cho giải pháp ${tech.techName}.`,
          timestamp: 'Vừa xong'
        }
      ]
    };

    setLeads(prev => [newLead, ...prev]);
    // increment tech interest count
    setTechListings(prev => prev.map(t => t.id === tech.id ? { ...t, interestCount: t.interestCount + 1 } : t));
    setActiveChatLeadId(newLead.id);
    navigate('/interests');
  };

  const sendChatMessage = (leadId: string, text: string) => {
    if (!text.trim()) return;
    const isVendor = currentUser.role === 'VENDOR';
    const newMsg = {
      id: `MSG-${Date.now()}`,
      sender: (isVendor ? 'VENDOR' : 'BUYER') as 'VENDOR' | 'BUYER',
      senderName: currentUser.fullName,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setLeads(prev => prev.map(ld => {
      if (ld.id === leadId) {
        return {
          ...ld,
          lastMessageAt: newMsg.timestamp,
          messages: [...ld.messages, newMsg]
        };
      }
      return ld;
    }));
  };

  const updateLeadStatus = (leadId: string, status: LeadInquiry['status']) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status } : l));
  };

  // Thu phí Nền tảng: Phí mở Lead & Ví Vendor (Pay-per-Lead)
  const [platformPricing, setPlatformPricing] = useState<PlatformPricingConfig>(DEFAULT_PLATFORM_PRICING);
  const [vendorWalletBalance, setVendorWalletBalance] = useState<number>(401000);
  const [vendorTransactions, setVendorTransactions] = useState<WalletTransaction[]>(INITIAL_WALLET_TRANSACTIONS);

  const updatePlatformPricing = (config: Partial<PlatformPricingConfig>) => {
    setPlatformPricing(prev => ({ ...prev, ...config }));
  };

  const topupVendorWallet = (amount: number) => {
    setVendorWalletBalance(prev => {
      const newBal = prev + amount;
      const newTx: WalletTransaction = {
        id: `TX-${Date.now()}`,
        type: 'TOPUP',
        amount: amount,
        description: `Nạp tiền vào ví nền tảng (+${amount.toLocaleString('vi-VN')} VNĐ)`,
        timestamp: new Date().toLocaleString('vi-VN'),
        balanceAfter: newBal
      };
      setVendorTransactions(t => [newTx, ...t]);
      return newBal;
    });
  };

  const unlockLead = (leadId: string): { success: boolean; message: string; fee?: number } => {
    const targetLead = leads.find(l => l.id === leadId);
    if (!targetLead) {
      return { success: false, message: 'Không tìm thấy yêu cầu Lead này.' };
    }
    if (targetLead.isUnlocked) {
      return { success: true, message: 'Lead này đã được mở khóa trước đó.', fee: 0 };
    }

    const fee = targetLead.unlockFee || (
      (targetLead.buyerEmployeeCount && targetLead.buyerEmployeeCount >= 500)
        ? platformPricing.largeLeadUnlockFee
        : platformPricing.smeLeadUnlockFee
    );

    if (vendorWalletBalance < fee) {
      return {
        success: false,
        message: `Số dư ví không đủ (${vendorWalletBalance.toLocaleString('vi-VN')} đ < ${fee.toLocaleString('vi-VN')} đ). Vui lòng nạp thêm ví.`,
        fee
      };
    }

    // Deduct wallet balance
    const newBal = vendorWalletBalance - fee;
    setVendorWalletBalance(newBal);

    const newTx: WalletTransaction = {
      id: `TX-${Date.now()}`,
      leadId: targetLead.id,
      leadTitle: targetLead.buyerCompany || targetLead.buyerName,
      type: 'LEAD_UNLOCK',
      amount: -fee,
      description: `Phí mở khóa hồ sơ Lead & RFQ #${targetLead.id} (${targetLead.buyerCompany || targetLead.buyerName})`,
      timestamp: new Date().toLocaleString('vi-VN'),
      balanceAfter: newBal
    };
    setVendorTransactions(prev => [newTx, ...prev]);

    // Update lead to unlocked
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return {
          ...l,
          isUnlocked: true,
          unlockFee: fee,
          unlockedAt: new Date().toLocaleString('vi-VN'),
          messages: [
            ...(l.messages || []),
            {
              id: `MSG-${Date.now()}-SYS`,
              sender: 'SYSTEM' as const,
              senderName: 'Hệ thống DBI',
              text: `[ĐÃ MỞ KHÓA] Nhà cung cấp đã thanh toán thành công phí mở Lead (${fee.toLocaleString('vi-VN')} VNĐ). Toàn quyền liên hệ trực tiếp qua điện thoại, Zalo hoặc trao đổi qua chatbox.`,
              timestamp: 'Vừa xong'
            }
          ]
        };
      }
      return l;
    }));

    return {
      success: true,
      message: `Đã mở khóa thành công Lead #${leadId}! Đã trừ ${fee.toLocaleString('vi-VN')} VNĐ từ ví nền tảng.`,
      fee
    };
  };

  // Compare List (2 to 3 items)
  const [compareList, setCompareList] = useState<string[]>(['LISTING-001', 'LISTING-002']);
  const [activeTechDetailId, setActiveTechDetailId] = useState<string>('LISTING-001');

  const addToCompare = (techId: string) => {
    if (compareList.includes(techId)) return;
    if (compareList.length >= 3) {
      alert('Chỉ có thể so sánh tối đa 3 giải pháp cùng lúc.');
      return;
    }
    setCompareList(prev => [...prev, techId]);
  };

  const removeFromCompare = (techId: string) => {
    setCompareList(prev => prev.filter(id => id !== techId));
  };

  const toggleCompare = (techId: string) => {
    setCompareList(prev => {
      if (prev.includes(techId)) {
        return prev.filter(id => id !== techId);
      }
      if (prev.length >= 3) {
        alert('Chỉ có thể chọn so sánh tối đa 3 giải pháp cùng lúc.');
        return prev;
      }
      return [...prev, techId];
    });
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const createLead = (leadData: any) => {
    const newLead: LeadInquiry = {
      id: `LEAD-${Date.now()}`,
      buyerId: currentUser.id,
      vendorId: leadData.vendorId || 'USER-VENDOR-01',
      techListingId: leadData.listingId || leadData.techListingId || 'LISTING-001',
      listingId: leadData.listingId || leadData.techListingId || 'LISTING-001',
      techName: leadData.techName,
      vendorName: leadData.vendorName,
      buyerName: leadData.buyerName || currentUser.company.companyName,
      buyerMst: leadData.buyerMst || currentUser.company.mst,
      buyerPhone: leadData.buyerPhone || currentUser.phone,
      buyerEmail: leadData.buyerEmail || currentUser.email,
      buyerDbiLevel: leadData.buyerDbiLevel ?? 2,
      buyerDbiScore: leadData.buyerDbiScore ?? 48,
      budgetRange: leadData.budgetRange || investmentPrefs.budgetText,
      timeline: leadData.timeline || 'Quý 2/2026',
      notes: leadData.notes || 'Khách hàng gửi yêu cầu tư vấn và báo giá qua DBI Portal',
      status: 'new',
      createdAt: new Date().toLocaleDateString('vi-VN'),
      lastMessageAt: 'Vừa xong',
      messages: [
        {
          id: `MSG-${Date.now()}-1`,
          sender: 'BUYER',
          senderName: 'Hệ thống DBI',
          text: `Doanh nghiệp ${leadData.buyerName || currentUser.company.companyName} đã gửi thông tin quan tâm tới giải pháp ${leadData.techName}.`,
          timestamp: 'Vừa xong'
        },
        {
          id: `MSG-${Date.now()}-2`,
          sender: 'BUYER',
          senderName: currentUser.fullName,
          text: leadData.notes || `Xin chào ${leadData.vendorName}, chúng tôi đang có nhu cầu tìm hiểu và nhận báo giá chi tiết cho giải pháp ${leadData.techName}.`,
          timestamp: 'Vừa xong'
        }
      ]
    };
    setLeads(prev => [newLead, ...prev]);
    setTechListings(prev => prev.map(t => t.id === leadData.listingId ? { ...t, interestCount: (t.interestCount || 0) + 1 } : t));
    setActiveChatLeadId(newLead.id);
    return newLead;
  };

  const activeLead = leads.find(l => l.id === activeChatLeadId) || leads[0];
  const chatMessages = activeLead ? activeLead.messages : [];

  // Tech Catalog & Excel Batch Import
  const [techCatalog, setTechCatalog] = useState<TechTaxonomyItem[]>(TECH_TAXONOMY);

  const addTechCatalogItem = (item: TechTaxonomyItem) => {
    setTechCatalog(prev => [item, ...prev]);
  };

  const addTaxonomyItem = (item: TechTaxonomyItem) => {
    setTechCatalog(prev => [item, ...prev]);
  };

  const batchImportCatalog = (items: TechTaxonomyItem[]) => {
    setTechCatalog(prev => [...items, ...prev]);
  };

  const addListing = (listing: any) => {
    const newListing: TechListing = {
      ...listing,
      id: `LISTING-${String(Date.now()).slice(-4)}`,
      createdAt: new Date().toISOString().split('T')[0],
      views: 0,
      interestCount: 0,
      rating: 5.0,
      reviewCount: 0
    };
    setTechListings(prev => [newListing, ...prev]);
  };

  const approveListing = (listingId: string) => {
    setTechListings(prev => prev.map(t => t.id === listingId ? { ...t, status: 'APPROVED' } : t));
  };

  const rejectListing = (listingId: string, _reason?: string) => {
    setTechListings(prev => prev.map(t => t.id === listingId ? { ...t, status: 'REJECTED' } : t));
  };

  // Assessment Questions & Weights
  const [questions, setQuestions] = useState<AssessmentQuestion[]>(SME_ASSESSMENT_QUESTIONS);

  const updateQuestionWeight = (questionId: string, weight: number) => {
    setQuestions(prev => prev.map(q => q.id === questionId ? { ...q, weight } : q));
  };

  // Matching Weights (Must validate sum = 1.0)
  const [matchingWeights, setMatchingWeights] = useState<MatchingWeights>(DEFAULT_MATCHING_WEIGHTS);

  const updateMatchingWeights = (newWeights: MatchingWeights): boolean => {
    const sum = Number((
      newWeights.dbiGapWeight +
      newWeights.industryFitWeight +
      newWeights.budgetFitWeight +
      newWeights.companySizeFitWeight +
      newWeights.vendorReputationWeight +
      newWeights.readinessWeight
    ).toFixed(2));

    if (Math.abs(sum - 1.0) > 0.001) {
      return false;
    }
    setMatchingWeights(newWeights);
    return true;
  };

  // Vendors KYC & Approval
  const [vendorsList, setVendorsList] = useState<UserAccount[]>(SAMPLE_USERS.filter(u => u.role === 'VENDOR'));
  const [pendingVendors, setPendingVendors] = useState<any[]>([
    {
      id: 'REQ-VND-001',
      companyName: 'Công ty Công nghệ CloudViet Systems',
      mst: '0316521489',
      representative: 'Nguyễn Thanh Sơn',
      province: 'TP. Hồ Chí Minh',
      licenseFile: 'GPKD_CloudViet_Scan.pdf',
      submittedAt: '2026-03-08T10:15:00Z'
    },
    {
      id: 'REQ-VND-002',
      companyName: 'Công ty TNHH Giải pháp Phần mềm Mekong Tech',
      mst: '0315889922',
      representative: 'Lê Hoàng Long',
      province: 'Cần Thơ',
      licenseFile: 'GPKD_MekongTech_2025.pdf',
      submittedAt: '2026-03-09T14:20:00Z'
    }
  ]);

  const approveVendor = (id: string) => {
    setPendingVendors(prev => prev.filter(v => v.id !== id));
  };

  const rejectVendor = (id: string, _reason?: string) => {
    setPendingVendors(prev => prev.filter(v => v.id !== id));
  };

  const updateVendorKyc = (userId: string, status: 'approved' | 'rejected', reason?: string) => {
    setVendorsList(prev => prev.map(v => {
      if (v.id === userId) {
        return {
          ...v,
          company: {
            ...v.company,
            kycStatus: status,
            rejectionReason: status === 'rejected' ? reason : undefined
          }
        };
      }
      return v;
    }));
  };

  // Users List
  const [usersList, setUsersList] = useState<UserAccount[]>(SAMPLE_USERS);

  const toggleUserLock = (userId: string) => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, isLocked: !u.isLocked } : u));
  };

  const changeUserRole = (userId: string, newRole: UserRole) => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  const resetAllDemoData = () => {
    setAssessmentAnswers({});
    setCurrentResult(SAMPLE_ASSESSMENT_RESULT);
    setTechListings(INITIAL_TECH_LISTINGS);
    setLeads(INITIAL_LEADS);
    setCompareList(['LISTING-001', 'LISTING-002']);
    setTechCatalog(TECH_TAXONOMY);
    setMatchingWeights(DEFAULT_MATCHING_WEIGHTS);
    setPlatformPricing(DEFAULT_PLATFORM_PRICING);
    setVendorWalletBalance(401000);
    setVendorTransactions(INITIAL_WALLET_TRANSACTIONS);
    try {
      localStorage.removeItem('dbi_assessment_answers');
      localStorage.removeItem('dbi_current_result');
      localStorage.removeItem('dbi_current_user');
      localStorage.removeItem('dbi_assessment_history');
    } catch {
      // ignore
    }
  };

  const value = useMemo(() => ({
    currentRoute,
    currentPath: currentRoute,
    navigate,
    currentUser,
    setCurrentUser,
    switchRole,
    logout,
    isAuthenticated,
    activeAssessmentId,
    setActiveAssessmentId,
    assessmentType,
    setAssessmentType,
    assessmentAnswers,
    saveAnswer,
    clearAssessmentDraft,
    submitAssessment,
    currentResult,
    setCurrentResult,
    assessmentHistory,
    investmentPrefs,
    saveInvestmentPrefs,
    techListings,
    addTechListing,
    addListing,
    updateListingStatus,
    approveListing,
    rejectListing,
    toggleInterestTech,
    activeTechDetailId,
    setActiveTechDetailId,
    compareList,
    comparisonList: compareList,
    toggleCompare,
    addToCompare,
    removeFromCompare,
    clearCompare,
    leads,
    createLead,
    activeChatLeadId,
    setActiveChatLeadId,
    chatMessages,
    sendChatMessage,
    updateLeadStatus,
    platformPricing,
    updatePlatformPricing,
    vendorWalletBalance,
    vendorTransactions,
    topupVendorWallet,
    unlockLead,
    techCatalog,
    addTechCatalogItem,
    addTaxonomyItem,
    batchImportCatalog,
    questions,
    updateQuestionWeight,
    matchingWeights,
    updateMatchingWeights,
    vendorsList,
    pendingVendors,
    approveVendor,
    rejectVendor,
    updateVendorKyc,
    usersList,
    toggleUserLock,
    changeUserRole,
    resetAllDemoData
  }), [
    currentRoute,
    currentUser,
    activeAssessmentId,
    assessmentType,
    assessmentAnswers,
    currentResult,
    assessmentHistory,
    investmentPrefs,
    techListings,
    activeTechDetailId,
    compareList,
    leads,
    activeChatLeadId,
    chatMessages,
    platformPricing,
    vendorWalletBalance,
    vendorTransactions,
    techCatalog,
    questions,
    matchingWeights,
    vendorsList,
    pendingVendors,
    usersList
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
