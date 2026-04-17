// ========== 型別定義 ==========

export type PropertyType = 'social' | 'general'; // 社會住宅 | 一般租賃
export type ListingType = 'entrusted' | 'active'; // 委託出租 | 出租中
export type SocialApplicationStatus = 'approved' | 'pending' | null;
export type LandlordPersonType = 'natural' | 'legal'; // 自然人 | 私法人

export interface LandlordAddress {
  zip?: string;
  city?: string;
  district?: string;
  street?: string;
  detail?: string;
}

export interface LandlordAgent {
  id: string;
  name: string;
  idNumber: string;
  phone: string;
  dayPhone?: string;
  address?: LandlordAddress;
}

export interface PropertyFormData {
  // 謄本資訊
  addressZip?: string;
  addressCity?: string;
  addressDistrict?: string;
  addressStreet?: string;
  addressDetail?: string;
  lotMain?: string;
  lotSub?: string;
  houseNoMain?: string;
  houseNoSub?: string;
  coordX?: string;
  coordY?: string;
  actualArea?: string;       // 實際使用面積(平方公尺)
  shareNumerator?: string;   // 建物持分比 分子
  shareDenominator?: string; // 建物持分比 分母
  // 基本資料
  socialPropertyNo?: string; // 社宅物件編號（社宅專用）
  caseName?: string;
  totalFloors?: string;
  communityName?: string;
  isOpenLayout?: boolean;
  rooms?: number;
  halls?: number;
  bathrooms?: number;
  kitchens?: number;
  hasBalcony?: boolean;
  houseCondition?: string;
  usableArea?: string;
  completionDate?: string;
  appliances?: string[];
  furniture?: string[];
  targetTenants?: string[];
  hasElevator?: boolean;
  allowCooking?: boolean;
  allowPets?: boolean;
  hasParking?: boolean;
  unitType?: string;
  // 加分項目
  decorationLevel?: string;
  decorationType?: string;
  livingRoomStatus?: string; // 社宅專用
  lifeConvenience?: string[];
  viewType?: string;         // 一般租賃專用（不同位置）
  // 費用
  expectedRent?: string;
  deposit?: string;
  rentIncludes?: string[];
  managementFee?: string;
  minLeasePeriod?: string;
  availableDate?: string;
  // 管理營業員
  branch?: string;
  department?: string;
  salesPerson?: string;
}

export interface Property {
  id: string;
  type: PropertyType;
  listingType: ListingType;
  socialApplicationStatus?: SocialApplicationStatus;
  socialCode?: string;
  name: string;
  address: string;
  rent: number;
  area: number;
  floor: string;
  layout: string;
  buildingType: string;
  landlordId?: string;
  tenantId?: string;
  socialMatchNo?: string;    // 社宅媒合編號（社宅專用）
  // 詳細資料（列表頁不使用）
  periodLabel?: string;
  statusTags?: { date: string; label: string }[];
  formData?: PropertyFormData;
}

export interface PropertyInspection {
  id: string;
  propertyId: string;
  inspectionDate: string;
  overallCondition: string;
  notes: string;
}

export interface Landlord {
  id: string;
  name: string;
  phone: string;         // 手機
  idNumber: string;      // 身分證字號
  email?: string;
  personType: LandlordPersonType;
  // 自然人欄位
  gender?: 'male' | 'female';
  dob?: string;
  dayPhone?: string;     // 市話(日)
  nightPhone?: string;   // 市話(夜)
  domicileAddress?: LandlordAddress;  // 戶籍地址
  mailingAddress?: LandlordAddress;   // 通訊地址
  // 私法人欄位
  companyName?: string;
  representative?: string;
  taxId?: string;
  registrationAddress?: LandlordAddress;
  // 匯款資料
  bankHolderName?: string;
  bankHolderIdNumber?: string;
  bankInstitution?: string;
  bankBranchName?: string;
  bankBranchCode?: string;
  bankAccountNo?: string;
  // 代理人（社宅用）
  agents?: LandlordAgent[];
}

export interface Tenant {
  id: string;
  socialTenantNo?: string;   // 社宅承租人編號（社宅專用）
  name: string;
  phone: string;
  idNumber: string;
  email: string;
  gender?: 'male' | 'female';
  dob?: string;
  dayPhone?: string;
  nightPhone?: string;
  idCardFrontImage?: string;
  idCardBackImage?: string;
  domicileAddress?: LandlordAddress;
  mailingAddress?: LandlordAddress;
  bankbookImage?: string;
  bankAccountName?: string;
  bankIdNumber?: string;
  bankCode?: string;
  bankBranchName?: string;
  bankBranchCode?: string;
  bankAccountNo?: string;
  householdRegisterImage?: string;
  spouseHouseholdRegisterImage?: string;
  applicantHouseholdName?: string;
  applicantRelation?: string;
  spouseHouseholdNo?: string;
  childrenCount?: number;
  familyMembers?: {
    id: string;
    name: string;
    idNumber: string;
    dob: string;
    relation: string;
    identityType: string;
  }[];
  propertyHoldings?: {
    id: string;
    holder: string;
    address: string;
    totalArea: string;
    shareRatio: string;
    shareArea: string;
    familyRegistered: boolean;
  }[];
}

export type DocumentCategory = '申請書' | '費用補助' | '契約' | '其他';

export interface DocumentType {
  id: string;
  name: string;
  category: DocumentCategory;
  icon: 'task' | 'quote' | 'description' | 'file';
}

export interface ContractDocumentItem {
  id: string;
  typeId: string;
  propertyId: string;
  createdAt: string;
  rentStart?: string;
  rentEnd?: string;
}

// ========== 出租人資料 ==========

export const landlords: Landlord[] = [
  {
    id: 'l001',
    name: '王大明',
    phone: '0912-345-678',
    idNumber: 'A123456789',
    email: 'wang@example.com',
    personType: 'natural',
    gender: 'male',
    dob: '1975-03-20',
    dayPhone: '02-2968-1234',
    nightPhone: '02-2968-5678',
    domicileAddress: {
      zip: '220',
      city: '新北市',
      district: '板橋區',
      street: '中山路一段',
      detail: '100號5樓',
    },
    mailingAddress: {
      zip: '220',
      city: '新北市',
      district: '板橋區',
      street: '中山路一段',
      detail: '100號5樓',
    },
    bankHolderName: '王大明',
    bankHolderIdNumber: 'A123456789',
    bankInstitution: '台灣銀行',
    bankBranchName: '板橋分行',
    bankBranchCode: '0040012',
    bankAccountNo: '001234567890',
    agents: [
      {
        id: 'ag001',
        name: '王小明',
        idNumber: 'A987654321',
        phone: '0933-111-222',
        dayPhone: '02-2968-9999',
        address: {
          zip: '220',
          city: '新北市',
          district: '板橋區',
          street: '中山路一段',
          detail: '100號5樓',
        },
      },
    ],
  },
  {
    id: 'l002',
    name: '林美玲',
    phone: '0923-456-789',
    idNumber: 'B234567890',
    email: 'lin@example.com',
    personType: 'natural',
    gender: 'female',
    dob: '1982-07-15',
    dayPhone: '02-2557-3344',
    domicileAddress: {
      zip: '103',
      city: '台北市',
      district: '大同區',
      street: '民權西路',
      detail: '55號3樓',
    },
    mailingAddress: {
      zip: '103',
      city: '台北市',
      district: '大同區',
      street: '民權西路',
      detail: '55號3樓',
    },
    bankHolderName: '林美玲',
    bankHolderIdNumber: 'B234567890',
    bankInstitution: '國泰世華銀行',
    bankBranchName: '大同分行',
    bankBranchCode: '0130023',
    bankAccountNo: '002345678901',
  },
  {
    id: 'l003',
    name: '陳志偉',
    phone: '0934-567-890',
    idNumber: 'C345678901',
    email: 'chen@example.com',
    personType: 'natural',
    gender: 'male',
    dob: '1968-11-08',
    dayPhone: '02-2381-5566',
    domicileAddress: {
      zip: '106',
      city: '台北市',
      district: '大安區',
      street: '和平東路一段',
      detail: '200號2樓',
    },
    mailingAddress: {
      zip: '106',
      city: '台北市',
      district: '大安區',
      street: '和平東路一段',
      detail: '200號2樓',
    },
    bankHolderName: '陳志偉',
    bankHolderIdNumber: 'C345678901',
    bankInstitution: '中信銀行',
    bankBranchName: '大安分行',
    bankBranchCode: '0220018',
    bankAccountNo: '003456789012',
  },
  {
    id: 'l004',
    name: '廣和建設有限公司',
    phone: '0922-888-999',
    idNumber: '12345678',
    email: 'kuanghe@example.com',
    personType: 'legal',
    companyName: '廣和建設有限公司',
    representative: '郭廣和',
    taxId: '12345678',
    dayPhone: '02-2345-6789',
    registrationAddress: {
      zip: '110',
      city: '台北市',
      district: '信義區',
      street: '松仁路',
      detail: '1號15樓',
    },
    bankHolderName: '廣和建設有限公司',
    bankHolderIdNumber: '12345678',
    bankInstitution: '玉山銀行',
    bankBranchName: '信義分行',
    bankBranchCode: '0080047',
    bankAccountNo: '004567890123',
  },
];

// ========== 承租人資料 ==========

export const tenants: Tenant[] = [
  {
    id: 't001',
    socialTenantNo: '住通台北B2T00000001',
    name: '張小華',
    phone: '0956-111-222',
    idNumber: 'D456789012',
    email: 'zhang@example.com',
    gender: 'male',
    dob: '1987-03-13',
    dayPhone: '02-2272-8899',
    nightPhone: '02-2272-7788',
    domicileAddress: {
      zip: '220',
      city: '新北市',
      district: '板橋區',
      street: '中山路二段',
      detail: '88號5樓',
    },
    mailingAddress: {
      zip: '220',
      city: '新北市',
      district: '板橋區',
      street: '中山路二段',
      detail: '88號5樓',
    },
    bankAccountName: '張小華',
    bankIdNumber: 'D456789012',
    bankCode: '004',
    bankBranchName: '板橋分行',
    bankBranchCode: '0041221',
    bankAccountNo: '123456789012',
    applicantHouseholdName: '張家戶',
    applicantRelation: '本人',
    spouseHouseholdNo: '無',
    childrenCount: 1,
    familyMembers: [
      {
        id: 'fm001',
        name: '沈晶譁',
        idNumber: 'K999789456',
        dob: '78-13-13',
        relation: '本人',
        identityType: '一般身分別',
      },
    ],
    propertyHoldings: [
      {
        id: 'ph001',
        holder: '羅罐瘋',
        address: '屏東縣潮州鎮金大路300號',
        totalArea: '200',
        shareRatio: '3/3',
        shareArea: '200',
        familyRegistered: true,
      },
    ],
  },
  {
    id: 't002',
    name: '李秀英',
    phone: '0967-222-333',
    idNumber: 'E567890123',
    email: 'li@example.com',
    gender: 'female',
    dob: '1990-09-02',
    dayPhone: '02-2955-6633',
    domicileAddress: {
      zip: '220',
      city: '新北市',
      district: '板橋區',
      street: '文化路一段',
      detail: '123號8樓',
    },
    mailingAddress: {
      zip: '220',
      city: '新北市',
      district: '板橋區',
      street: '文化路一段',
      detail: '123號8樓',
    },
    bankAccountName: '李秀英',
    bankIdNumber: 'E567890123',
    bankCode: '013',
    bankBranchName: '板橋分行',
    bankBranchCode: '0130038',
    bankAccountNo: '987654321000',
  },
  {
    id: 't003',
    socialTenantNo: '住通台北B2T00000003',
    name: '黃建國',
    phone: '0978-333-444',
    idNumber: 'F678901234',
    email: 'huang@example.com',
    gender: 'male',
    dob: '1982-11-20',
    dayPhone: '02-2966-5544',
    nightPhone: '02-2966-1122',
    domicileAddress: {
      zip: '220',
      city: '新北市',
      district: '板橋區',
      street: '四川路二段',
      detail: '47巷3樓',
    },
    mailingAddress: {
      zip: '220',
      city: '新北市',
      district: '板橋區',
      street: '四川路二段',
      detail: '47巷3樓',
    },
    bankAccountName: '黃建國',
    bankIdNumber: 'F678901234',
    bankCode: '822',
    bankBranchName: '板橋分行',
    bankBranchCode: '8220089',
    bankAccountNo: '001122334455',
    applicantHouseholdName: '黃家戶',
    applicantRelation: '戶長',
    spouseHouseholdNo: 'A22000001',
    childrenCount: 2,
    familyMembers: [
      {
        id: 'fm003',
        name: '黃小明',
        idNumber: 'N123456789',
        dob: '95-08-19',
        relation: '子女',
        identityType: '一般身分別',
      },
      {
        id: 'fm004',
        name: '黃小美',
        idNumber: 'N223456789',
        dob: '97-10-04',
        relation: '子女',
        identityType: '一般身分別',
      },
    ],
    propertyHoldings: [],
  },
];

// ========== 物件資料 ==========
// listingType: 'entrusted' = 委託出租物件, 'active' = 出租中物件

export const properties: Property[] = [
  // 出租中物件
  {
    id: 'p001',
    type: 'social',
    listingType: 'active',
    socialApplicationStatus: 'approved',
    socialCode: '住通台北B301555660125',
    socialMatchNo: '住通台北B2M00000001',
    name: '🏠 近捷運亞東醫院站 ✨全新裝潢2房1廳',
    address: '板橋區四川路二段47巷3樓',
    rent: 20000,
    area: 12,
    floor: '7F / 12F',
    layout: '一房一廳',
    buildingType: '公寓',
    landlordId: 'l001',
    tenantId: 't001',
    periodLabel: '社宅第五期 1040101',
    statusTags: [
      { date: '2025-06-13', label: '張順心建立' },
      { date: '2025-05-14', label: '陳天成更新' },
    ],
    formData: {
      addressZip: '220',
      addressCity: '新北市',
      addressDistrict: '板橋區',
      addressStreet: '四川路二段',
      addressDetail: '47巷3樓',
      lotMain: '0155',
      lotSub: '00660',
      houseNoMain: '00125',
      houseNoSub: '000',
      coordX: '121.4637',
      coordY: '25.0173',
      actualArea: '39.67',
      shareNumerator: '1',
      shareDenominator: '10000',
      socialPropertyNo: '住通台北B2M00000001',
      caseName: '近捷運亞東醫院站 全新裝潢2房1廳',
      totalFloors: '12',
      communityName: '四川路社區',
      isOpenLayout: false,
      rooms: 1,
      halls: 1,
      bathrooms: 1,
      kitchens: 1,
      hasBalcony: true,
      houseCondition: '全新裝潢，採光良好，鄰近捷運亞東醫院站',
      usableArea: '12',
      completionDate: '2005-03-15',
      appliances: ['洗衣機', '冰箱', '冷氣'],
      furniture: ['床', '衣櫃', '沙發'],
      targetTenants: ['學生', '上班族', '家庭'],
      hasElevator: true,
      allowCooking: true,
      allowPets: false,
      hasParking: false,
      unitType: '整層住家',
      decorationLevel: '活化裝潢',
      decorationType: '現代風',
      livingRoomStatus: '中上裝修',
      lifeConvenience: ['近捷運', '近便利商店', '近夜市'],
      viewType: '一般市景',
      expectedRent: '20000',
      deposit: '2個月',
      rentIncludes: ['管理費', '網路'],
      managementFee: '1500',
      minLeasePeriod: '1年',
      availableDate: '2025-07-01',
      branch: '新北板橋分店',
      department: '業務部',
      salesPerson: '陳小明',
    },
  },
  {
    id: 'p002',
    type: 'general',
    listingType: 'active',
    socialApplicationStatus: null,
    name: '拎包可入住🏠租金含車管費🚗2房2廳',
    address: '板橋區四川路二段47巷3樓',
    rent: 20000,
    area: 12,
    floor: '7F / 12F',
    layout: '一房一廳',
    buildingType: '公寓',
    statusTags: [
      { date: '2025-05-13', label: '第五期 更新' },
      { date: '2025-05-12', label: '第五期 提出' },
    ],
    formData: {
      addressZip: '220',
      addressCity: '新北市',
      addressDistrict: '板橋區',
      addressStreet: '四川路二段',
      addressDetail: '47巷3樓',
      lotMain: '0155',
      lotSub: '00660',
      houseNoMain: '00125',
      houseNoSub: '000',
      coordX: '121.4637',
      coordY: '25.0173',
      actualArea: '39.67',
      shareNumerator: '1',
      shareDenominator: '10000',
      caseName: '拎包可入住 租金含車管費 2房2廳',
      totalFloors: '12',
      communityName: '',
      isOpenLayout: false,
      rooms: 2,
      halls: 2,
      bathrooms: 1,
      kitchens: 1,
      hasBalcony: false,
      houseCondition: '含車位，管理費已含，拎包即可入住',
      usableArea: '12',
      completionDate: '2008-06-20',
      appliances: ['洗衣機', '冷氣'],
      furniture: ['床', '沙發', '餐桌'],
      targetTenants: ['上班族', '家庭'],
      hasElevator: true,
      allowCooking: true,
      allowPets: true,
      hasParking: true,
      unitType: '整層住家',
      decorationLevel: '一般清潔',
      decorationType: '現代風',
      lifeConvenience: ['近便利商店', '近夜市'],
      viewType: '一般市景',
      expectedRent: '20000',
      deposit: '2個月',
      rentIncludes: ['管理費', '水費'],
      managementFee: '0',
      minLeasePeriod: '1年',
      availableDate: '2025-06-15',
      branch: '新北板橋分店',
      department: '業務部',
      salesPerson: '林美玲',
    },
  },
  {
    id: 'p003',
    type: 'social',
    listingType: 'active',
    socialApplicationStatus: 'approved',
    socialCode: '住通台北B301555660125',
    socialMatchNo: '住通台北B2M00000003',
    name: '秒租🏡新埔捷運1分鐘裝潢滿1房1廳',
    address: '板橋區四川路二段47巷3樓',
    rent: 20000,
    area: 12,
    floor: '7F / 12F',
    layout: '一房一廳',
    buildingType: '公寓',
    landlordId: 'l002',
    tenantId: 't003',
    periodLabel: '社宅第五期 1040101',
    statusTags: [
      { date: '2025-06-01', label: '張順心建立' },
      { date: '2025-05-20', label: '陳天成更新' },
    ],
    formData: {
      addressZip: '220',
      addressCity: '新北市',
      addressDistrict: '板橋區',
      addressStreet: '四川路二段',
      addressDetail: '47巷3樓',
      lotMain: '0155',
      lotSub: '00661',
      houseNoMain: '00126',
      houseNoSub: '000',
      coordX: '121.4640',
      coordY: '25.0175',
      actualArea: '39.67',
      shareNumerator: '1',
      shareDenominator: '10000',
      socialPropertyNo: '住通台北B2M00000003',
      caseName: '新埔捷運1分鐘 裝潢滿1房1廳',
      totalFloors: '12',
      communityName: '新埔社區',
      isOpenLayout: false,
      rooms: 1,
      halls: 1,
      bathrooms: 1,
      kitchens: 1,
      hasBalcony: true,
      houseCondition: '全新裝潢，新埔捷運步行1分鐘',
      usableArea: '12',
      completionDate: '2003-08-10',
      appliances: ['洗衣機', '冰箱', '冷氣', '熱水器'],
      furniture: ['床', '衣櫃'],
      targetTenants: ['學生', '上班族'],
      hasElevator: false,
      allowCooking: true,
      allowPets: false,
      hasParking: false,
      unitType: '整層住家',
      decorationLevel: '豪華裝潢',
      decorationType: '日式風',
      livingRoomStatus: '中上裝修',
      lifeConvenience: ['近捷運', '近超市', '近便利商店'],
      viewType: '中上景觀',
      expectedRent: '20000',
      deposit: '2個月',
      rentIncludes: ['網路'],
      managementFee: '1200',
      minLeasePeriod: '1年',
      availableDate: '2025-08-01',
      branch: '新北板橋分店',
      department: '業務部',
      salesPerson: '王大明',
    },
  },
  {
    id: 'p004',
    type: 'social',
    listingType: 'active',
    socialApplicationStatus: 'pending',
    socialMatchNo: '住通台北B2M00000004',
    name: '府中捷運生活機能強、市場餐廳近，舒適安靜',
    address: '板橋區四川路二段47巷3樓',
    rent: 20000,
    area: 12,
    floor: '7F / 12F',
    layout: '一房一廳',
    buildingType: '公寓',
    periodLabel: '社宅第四期 1040101',
    statusTags: [
      { date: '2025-04-10', label: '第四期 申請中' },
    ],
    formData: {
      addressZip: '220',
      addressCity: '新北市',
      addressDistrict: '板橋區',
      addressStreet: '四川路二段',
      addressDetail: '47巷3樓',
      lotMain: '0156',
      lotSub: '00070',
      houseNoMain: '00200',
      houseNoSub: '001',
      coordX: '121.4620',
      coordY: '25.0160',
      actualArea: '39.67',
      shareNumerator: '1',
      shareDenominator: '10000',
      socialPropertyNo: '住通台北B2M00000004',
      caseName: '府中捷運 生活機能強 市場餐廳近',
      totalFloors: '12',
      communityName: '府中社區',
      isOpenLayout: false,
      rooms: 1,
      halls: 1,
      bathrooms: 1,
      kitchens: 1,
      hasBalcony: false,
      houseCondition: '府中捷運生活機能強，市場、餐廳近在咫尺',
      usableArea: '12',
      completionDate: '2001-11-25',
      appliances: ['冷氣', '熱水器'],
      furniture: ['床'],
      targetTenants: ['上班族', '家庭'],
      hasElevator: false,
      allowCooking: false,
      allowPets: false,
      hasParking: false,
      unitType: '套房',
      decorationLevel: '一般清潔',
      decorationType: '現代風',
      livingRoomStatus: '無客廳',
      lifeConvenience: ['近便利商店', '近學校', '近醫院'],
      viewType: '一般市景',
      expectedRent: '20000',
      deposit: '2個月',
      rentIncludes: [],
      managementFee: '800',
      minLeasePeriod: '6個月',
      availableDate: '',
      branch: '新北板橋分店',
      department: '業務部',
      salesPerson: '林美玲',
    },
  },
  {
    id: 'p005',
    type: 'general',
    listingType: 'active',
    socialApplicationStatus: null,
    name: '🔥板橋致理旁/景觀健康兩房/可租含傢俱',
    address: '板橋區四川路二段47巷3樓',
    rent: 20000,
    area: 12,
    floor: '7F / 12F',
    layout: '一房一廳',
    buildingType: '公寓',
    landlordId: 'l003',
    tenantId: 't001',
    statusTags: [
      { date: '2025-03-20', label: '物件更新' },
      { date: '2025-03-01', label: '物件提出' },
    ],
    formData: {
      addressZip: '220',
      addressCity: '新北市',
      addressDistrict: '板橋區',
      addressStreet: '文化路一段',
      addressDetail: '100號12樓',
      lotMain: '0180',
      lotSub: '00055',
      houseNoMain: '00300',
      houseNoSub: '002',
      coordX: '121.4598',
      coordY: '25.0145',
      actualArea: '45.12',
      shareNumerator: '1',
      shareDenominator: '8000',
      caseName: '板橋致理旁 景觀健康兩房 含傢俱',
      totalFloors: '12',
      communityName: '致理社區',
      isOpenLayout: false,
      rooms: 2,
      halls: 1,
      bathrooms: 1,
      kitchens: 1,
      hasBalcony: true,
      houseCondition: '板橋致理旁，高樓景觀，含全套傢俱設備',
      usableArea: '12',
      completionDate: '2010-02-08',
      appliances: ['洗衣機', '冰箱', '冷氣', '微波爐'],
      furniture: ['床', '衣櫃', '沙發', '餐桌', '書桌'],
      targetTenants: ['學生', '上班族'],
      hasElevator: true,
      allowCooking: false,
      allowPets: false,
      hasParking: false,
      unitType: '整層住家',
      decorationLevel: '中上裝潢',
      decorationType: '北歐風',
      lifeConvenience: ['近超市', '近便利商店', '近學校'],
      viewType: '中上景觀',
      expectedRent: '20000',
      deposit: '2個月',
      rentIncludes: ['管理費', '網路'],
      managementFee: '2000',
      minLeasePeriod: '1年',
      availableDate: '2025-06-01',
      branch: '新北板橋分店',
      department: '業務部',
      salesPerson: '陳志偉',
    },
  },
  {
    id: 'p006',
    type: 'social',
    listingType: 'active',
    socialApplicationStatus: 'approved',
    socialCode: '住通台北B301555660125',
    socialMatchNo: '住通台北B2M00000006',
    name: '🏠 近捷運亞東醫院站 ✨全新裝潢2房1廳',
    address: '板橋區四川路二段47巷3樓',
    rent: 18000,
    area: 10,
    floor: '3F / 8F',
    layout: '一房一廳',
    buildingType: '華廈',
    landlordId: 'l003',
    periodLabel: '社宅第五期 1040101',
    statusTags: [
      { date: '2025-06-10', label: '張順心建立' },
      { date: '2025-05-30', label: '陳天成更新' },
    ],
    formData: {
      addressZip: '220',
      addressCity: '新北市',
      addressDistrict: '板橋區',
      addressStreet: '四川路二段',
      addressDetail: '47巷3樓',
      lotMain: '0155',
      lotSub: '00662',
      houseNoMain: '00127',
      houseNoSub: '000',
      coordX: '121.4638',
      coordY: '25.0174',
      actualArea: '33.06',
      shareNumerator: '1',
      shareDenominator: '12000',
      socialPropertyNo: '住通台北B2M00000006',
      caseName: '亞東醫院站 全新裝潢2房1廳',
      totalFloors: '8',
      communityName: '',
      isOpenLayout: false,
      rooms: 2,
      halls: 1,
      bathrooms: 1,
      kitchens: 1,
      hasBalcony: false,
      houseCondition: '3樓，採光好，亞東醫院旁，生活機能便利',
      usableArea: '10',
      completionDate: '1998-05-22',
      appliances: ['冷氣', '熱水器'],
      furniture: ['床', '衣櫃'],
      targetTenants: ['學生', '上班族', '外國人'],
      hasElevator: false,
      allowCooking: true,
      allowPets: false,
      hasParking: false,
      unitType: '整層住家',
      decorationLevel: '活化裝潢',
      decorationType: '現代風',
      livingRoomStatus: '中上裝修',
      lifeConvenience: ['近捷運', '近醫院', '近超市'],
      viewType: '一般市景',
      expectedRent: '18000',
      deposit: '2個月',
      rentIncludes: ['管理費'],
      managementFee: '1000',
      minLeasePeriod: '1年',
      availableDate: '2025-07-15',
      branch: '新北板橋分店',
      department: '業務部',
      salesPerson: '王大明',
    },
  },
  // 委託出租物件
  {
    id: 'p007',
    type: 'social',
    listingType: 'entrusted',
    socialApplicationStatus: 'pending',
    name: '板橋近江子翠捷運站 精緻裝潢套房',
    address: '板橋區文化路二段100號5樓',
    rent: 15000,
    area: 8,
    floor: '5F / 10F',
    layout: '套房',
    buildingType: '公寓',
    landlordId: 'l001',
  },
  {
    id: 'p008',
    type: 'general',
    listingType: 'entrusted',
    socialApplicationStatus: null,
    name: '新埔捷運旁 採光良好兩房兩廳',
    address: '板橋區民族路25號3樓',
    rent: 25000,
    area: 20,
    floor: '3F / 12F',
    layout: '兩房兩廳',
    buildingType: '電梯大樓',
    landlordId: 'l002',
  },
  {
    id: 'p009',
    type: 'social',
    listingType: 'entrusted',
    socialApplicationStatus: null,
    name: '府中捷運3分鐘 全新裝潢三房含車位',
    address: '板橋區府中路55號8樓',
    rent: 32000,
    area: 30,
    floor: '8F / 15F',
    layout: '三房兩廳',
    buildingType: '電梯大樓',
    landlordId: 'l003',
  },
  {
    id: 'p010',
    type: 'general',
    listingType: 'entrusted',
    socialApplicationStatus: null,
    name: '亞東醫院旁 安靜住宅區精品套房',
    address: '板橋區長江路三段10號2樓',
    rent: 12000,
    area: 6,
    floor: '2F / 6F',
    layout: '套房',
    buildingType: '公寓',
    landlordId: 'l001',
  },
];

// ========== 屋況檢索 ==========

export const propertyInspections: PropertyInspection[] = [
  {
    id: 'pi001',
    propertyId: 'p001',
    inspectionDate: '2025-01-15',
    overallCondition: '良好',
    notes: '牆面輕微刮痕，已修補。衛浴設備正常。',
  },
];

// ========== 文件類型 ==========

export const documentTypes: DocumentType[] = [
  // 申請書
  { id: 'dt1', name: '表單1.出租人出租住宅申請書 + 表單2.屋況及租屋安全檢核表', category: '申請書', icon: 'task' },
  { id: 'dt2', name: '表單5.民眾(房客)承租住宅申請書', category: '申請書', icon: 'task' },
  // 費用補助
  { id: 'dt3', name: '表單3.出租人補助費用申請書', category: '費用補助', icon: 'quote' },
  { id: 'dt4', name: '表單6.承租人補助費用申請書', category: '費用補助', icon: 'quote' },
  { id: 'dt5', name: '表單8.業者服務補助費用申請書', category: '費用補助', icon: 'quote' },
  { id: 'dt6', name: '表單21.換居戶補助費用申請書', category: '費用補助', icon: 'quote' },
  // 契約
  { id: 'dt7', name: '社會住宅-包租契約書', category: '契約', icon: 'description' },
  { id: 'dt8', name: '社會住宅-轉租契約書', category: '契約', icon: 'description' },
  // 其他
  { id: 'dt9', name: '附表單1.估價師租金簽註意見書', category: '其他', icon: 'file' },
  { id: 'dt10', name: '附表單2.代理人授權書', category: '其他', icon: 'file' },
  { id: 'dt11', name: '附表單3.共有住宅代表人授權書', category: '其他', icon: 'file' },
];

// ========== 契約文件清單 ==========

export const contractDocumentItems: ContractDocumentItem[] = [
  // p001 — 申請書 + 費用補助 + 契約 + 其他
  { id: 'cdi001', typeId: 'dt1',  propertyId: 'p001', createdAt: '2026-03-05' },
  { id: 'cdi002', typeId: 'dt3',  propertyId: 'p001', createdAt: '2026-03-08' },
  { id: 'cdi003', typeId: 'dt7',  propertyId: 'p001', createdAt: '2026-03-05', rentStart: '2026-04-01', rentEnd: '2028-03-31' },
  { id: 'cdi004', typeId: 'dt9',  propertyId: 'p001', createdAt: '2026-03-10' },
  { id: 'cdi005', typeId: 'dt10', propertyId: 'p001', createdAt: '2026-03-10' },

  // p002 — 申請書 + 費用補助
  { id: 'cdi006', typeId: 'dt1',  propertyId: 'p002', createdAt: '2026-02-20' },
  { id: 'cdi007', typeId: 'dt4',  propertyId: 'p002', createdAt: '2026-02-22' },
  { id: 'cdi008', typeId: 'dt5',  propertyId: 'p002', createdAt: '2026-02-22' },

  // p003 — 契約 + 其他
  { id: 'cdi009', typeId: 'dt7',  propertyId: 'p003', createdAt: '2026-01-15', rentStart: '2026-02-01', rentEnd: '2027-01-31' },
  { id: 'cdi010', typeId: 'dt11', propertyId: 'p003', createdAt: '2026-01-18' },

  // p004 — 申請書 + 費用補助 + 其他
  { id: 'cdi011', typeId: 'dt1',  propertyId: 'p004', createdAt: '2026-03-01' },
  { id: 'cdi012', typeId: 'dt6',  propertyId: 'p004', createdAt: '2026-03-03' },
  { id: 'cdi013', typeId: 'dt9',  propertyId: 'p004', createdAt: '2026-03-05' },
];
