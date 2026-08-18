/**
 * NAMASTE - ICD-11 EHR Integration Platform
 * Mock Clinical Dataset & Terminology Store
 */

const NAMASTE_DATA = {
    // Current logged-in user profile
    currentUser: {
        id: "DOC-9421",
        name: "Dr. Vikram Sharma",
        title: "Senior Clinical Specialist (BAMS, MD Ayush)",
        role: "doctor", // 'doctor', 'staff', 'admin', 'developer'
        hospital: "National Institute of Ayurveda & Integrated EHR Health Center, New Delhi",
        abdmId: "ABDM-DOC-948271",
        department: "Kayachikitsa & General Medicine"
    },

    // Statistics summary for Dashboard & Analytics
    stats: {
        todaysPatients: 18,
        pendingMappings: 7,
        recentRecords: 24,
        totalAyushTermsRecorded: 1248,
        mappedToIcd11: 934,
        verifiedMappings: 780,
        suggestedMappings: 154,
        rejectedMappings: 32,
        unmappedTerms: 132
    },

    // AYUSH Standard Terminology Database
    ayushTerms: [
        {
            id: "AYU-AML-042",
            namasteCode: "AYU-KC-AML-001",
            term: "Amlapitta",
            system: "Ayurveda",
            category: "Kayachikitsa (Internal Medicine)",
            description: "A disease caused by excessive pitta leading to burning sensation in stomach, acid regurgitation, indigestion and nausea.",
            icd11Candidate: {
                code: "DA60",
                title: "Gastritis (including non-infective gastritis & acid peptic disease)",
                tm2Code: "TM2.26-0041",
                confidence: 87,
                status: "Pending", // 'Verified', 'Pending', 'Modified', 'Rejected'
                matchReason: "Direct semantic overlap in upper GI hyperacidity, acid reflux and mucosal irritation signs."
            },
            symptoms: ["Hrid-daha (Heartburn)", "Tikta-amla udgara (Sour eructation)", "Utklesha (Nausea)", "Aruchi (Anorexia)"]
        },
        {
            id: "AYU-SND-108",
            namasteCode: "AYU-KC-SND-014",
            term: "Sandhivata",
            system: "Ayurveda",
            category: "Shalya / Kayachikitsa",
            description: "Vata pathology localized in joint capsules causing pain, swelling on movement, stiffness and crepitus.",
            icd11Candidate: {
                code: "FA00",
                title: "Osteoarthritis of joint (Primary or Secondary)",
                tm2Code: "TM2.26-0182",
                confidence: 92,
                status: "Verified",
                verifiedBy: "Dr. Vikram Sharma",
                verifiedAt: "2026-08-16 11:30 AM",
                matchReason: "High concordant mapping based on WHO ICD-11 Chapter 26 Traditional Medicine module (TM2-Vata joint disorders)."
            },
            symptoms: ["Sandhi-shoola (Joint pain)", "Sandhi-shotha (Joint swelling)", "Atopa (Crepitus)", "Prasarana-akunchana-vedana (Pain on motion)"]
        },
        {
            id: "AYU-KAS-019",
            namasteCode: "AYU-KC-KAS-003",
            term: "Kasa (Vataja / Kaphaja)",
            system: "Ayurveda",
            category: "Pranavaha Srotas",
            description: "Disorder of respiratory tract characterized by cough, chest discomfort, and abnormal movement of Prana Vayu.",
            icd11Candidate: {
                code: "MD11",
                title: "Cough (Acute or Chronic Respiratory Symptom)",
                tm2Code: "TM2.26-0095",
                confidence: 94,
                status: "Verified",
                verifiedBy: "Dr. Vikram Sharma",
                verifiedAt: "2026-08-14 04:15 PM",
                matchReason: "Exact anatomical and symptomatic correspondence with WHO respiratory symptoms taxonomy."
            },
            symptoms: ["Shushka-kasa (Dry cough)", "Urash-shoola (Chest irritation)", "Kanth-kandu (Throat tickle)"]
        },
        {
            id: "AYU-PRM-088",
            namasteCode: "AYU-KC-PRM-008",
            term: "Prameha (Madhumeha)",
            system: "Ayurveda",
            category: "Metabolic Disorders",
            description: "Metabolic syndrome characterized by turbid urine, polyuria, weight changes, and insulin resistance manifestations.",
            icd11Candidate: {
                code: "5A11",
                title: "Type 2 Diabetes Mellitus",
                tm2Code: "TM2.26-0310",
                confidence: 91,
                status: "Verified",
                verifiedBy: "Dr. Ananya Roy",
                verifiedAt: "2026-08-12 09:45 AM",
                matchReason: "Direct equivalence validated in ICMR & Ministry of Ayush clinical dual-coding guidelines."
            },
            symptoms: ["Prabhuta-mutrata (Polyuria)", "Avila-mutrata (Turbid urine)", "Pipasa (Polydipsia)", "Kshudhadhikya (Polyphagia)"]
        },
        {
            id: "UNI-TBM-005",
            namasteCode: "UNI-AMR-TBM-002",
            term: "Humma-e-Yabis (Tbm-e-Yabis)",
            system: "Unani",
            category: "Amraz-e-Badan",
            description: "Unani disease category relating to febrile conditions with dryness of temperament and metabolic alterations.",
            icd11Candidate: {
                code: "1C80",
                title: "Unspecified Febrile Illness / Pyrexia",
                tm2Code: "TM2.27-0012",
                confidence: 79,
                status: "Pending",
                matchReason: "Moderate similarity based on symptom clusters of pyrexia and dry skin manifestation."
            },
            symptoms: ["Humma (Fever)", "Yabusat (Dryness)", "Sedaa (Headache)"]
        },
        {
            id: "SID-KAB-012",
            namasteCode: "SID-NOI-KAB-001",
            term: "Kabha Suram (Kabha Jwaram)",
            system: "Siddha",
            category: "Noi Naadi",
            description: "Siddha medical term for respiratory illness presenting with phlegm accumulation, chills, and elevated temperature.",
            icd11Candidate: {
                code: "CA40",
                title: "Acute Bronchitis / Viral Upper Respiratory Infection",
                tm2Code: "TM2.28-0044",
                confidence: 84,
                status: "Pending",
                matchReason: "Algorithmic alignment with Siddha morbidity dataset v2.4 and ICD-11 URTI taxonomy."
            },
            symptoms: ["Irumal (Cough)", "Suram (Fever)", "Kabal (Phlegm)"]
        },
        {
            id: "AYU-KML-031",
            namasteCode: "AYU-KC-KML-002",
            term: "Kamala (Kosthashrita)",
            system: "Ayurveda",
            category: "Raktavaha Srotas",
            description: "Hepatic dysfunction characterized by scleral icterus, yellow skin discoloration, malaise, and dark urine.",
            icd11Candidate: {
                code: "DB90",
                title: "Hepatic dysfunction or Jaundice unspecified",
                tm2Code: "TM2.26-0062",
                confidence: 89,
                status: "Pending",
                matchReason: "High correspondence in hyperbilirubinemia clinical signs and sclerotic discoloration."
            },
            symptoms: ["Netra-peetata (Jaundice)", "Peeta-mutrata (Dark urine)", "Daurbalya (Fatigue)"]
        },
        {
            id: "AYU-VAT-150",
            namasteCode: "AYU-KC-VAT-022",
            term: "Gridhrasi (Vataja)",
            system: "Ayurveda",
            category: "Vata Vyadhi",
            description: "Radiating pain starting from hip down to thigh, knee, calf and foot with stiffness and twitching.",
            icd11Candidate: {
                code: "ME84",
                title: "Sciatica / Radiculopathy of lumbar spine",
                tm2Code: "TM2.26-0210",
                confidence: 95,
                status: "Verified",
                verifiedBy: "Dr. Vikram Sharma",
                verifiedAt: "2026-08-10 02:20 PM",
                matchReason: "Exact neuro-anatomical match with lower limb nerve distribution pain."
            },
            symptoms: ["Sphik-spandana (Hip pain)", "Kati-uru-janu-pada vedana (Radiating leg pain)", "Stambha (Stiffness)"]
        }
    ],

    // Patient Directory & EHR Records
    patients: [
        {
            id: "P001",
            abhaId: "91-4820-1192-3011",
            name: "Rahul Kumar",
            age: 42,
            gender: "Male",
            bloodGroup: "O+",
            phone: "+91 98765 43210",
            address: "House 142, Sector 15, Rohini, New Delhi",
            lastVisit: "Today (17 Aug 2026)",
            status: "Active Encounter",
            allergies: ["Penicillin", "Dust Mites"],
            vitals: {
                bp: "128/82 mmHg",
                pulse: "74 bpm",
                temp: "98.4 °F",
                bmi: "24.2 kg/m²"
            },
            activeConditions: [
                {
                    ayushTerm: "Amlapitta",
                    namasteCode: "AYU-KC-AML-001",
                    icd11Code: "DA60",
                    icd11Title: "Gastritis (including non-infective acid peptic disease)",
                    confidence: 87,
                    status: "Pending Verification",
                    diagnosedDate: "17 Aug 2026",
                    doctor: "Dr. Vikram Sharma"
                },
                {
                    ayushTerm: "Kasa (Vataja)",
                    namasteCode: "AYU-KC-KAS-003",
                    icd11Code: "MD11",
                    icd11Title: "Cough (Acute Respiratory)",
                    confidence: 94,
                    status: "Verified",
                    diagnosedDate: "02 Jul 2026",
                    doctor: "Dr. Vikram Sharma"
                }
            ],
            encounters: [
                {
                    id: "ENC-8821",
                    date: "17 Aug 2026",
                    type: "Consultation & Dual Coding",
                    doctor: "Dr. Vikram Sharma",
                    chiefComplaint: "Burning epigastric pain, acid eructation, nausea after fatty meals for 3 weeks.",
                    ayushDiagnosis: "Amlapitta",
                    icd11Mapping: "DA60 - Gastritis (non-infective acid peptic disease)",
                    confidence: 87,
                    status: "Pending Verification",
                    notes: "Patient reports relief with cold milk. Advised pathya-apathya (dietary controls) along with Avipattikar Churna.",
                    prescription: [
                        { name: "Avipattikar Churna", dose: "3g", freq: "BD before meals", duration: "14 days", type: "Ayurvedic formulation" },
                        { name: "Sutshekhar Ras (Plain)", dose: "1 tab", freq: "BD after meals", duration: "14 days", type: "Ayurvedic formulation" },
                        { name: "Syrup Sucralfate 5ml", dose: "5ml", freq: "TDS", duration: "7 days", type: "Allopathic co-prescription" }
                    ]
                },
                {
                    id: "ENC-6410",
                    date: "02 Jul 2026",
                    type: "Follow-up Visit",
                    doctor: "Dr. Vikram Sharma",
                    chiefComplaint: "Dry cough following viral fever episode.",
                    ayushDiagnosis: "Kasa (Vataja)",
                    icd11Mapping: "MD11 - Cough",
                    confidence: 94,
                    status: "Verified",
                    notes: "Chest clear on auscultation. Responded well to Sitopaladi Churna.",
                    prescription: [
                        { name: "Sitopaladi Churna + Honey", dose: "3g", freq: "TDS", duration: "5 days", type: "Ayurvedic formulation" }
                    ]
                }
            ],
            reports: [
                { title: "Upper GI Endoscopy Report", date: "15 Aug 2026", type: "Diagnostic PDF", doctor: "Max Healthcare", status: "Mild antral gastritis observed" },
                { title: "Complete Blood Count (CBC) & LFT", date: "14 Aug 2026", type: "Lab Report", doctor: "Pathkind Diagnostics", status: "Hb 14.2 g/dL, LFT Normal" }
            ]
        },
        {
            id: "P002",
            abhaId: "91-8841-9023-1144",
            name: "Anita Devi",
            age: 54,
            gender: "Female",
            bloodGroup: "B+",
            phone: "+91 98112 33445",
            address: "Flat 4B, Vasundhara Apartments, Dwarka, New Delhi",
            lastVisit: "16 Aug 2026",
            status: "Follow-up Scheduled",
            allergies: ["Sulfa drugs"],
            vitals: {
                bp: "134/86 mmHg",
                pulse: "78 bpm",
                temp: "98.1 °F",
                bmi: "27.4 kg/m²"
            },
            activeConditions: [
                {
                    ayushTerm: "Sandhivata",
                    namasteCode: "AYU-KC-SND-014",
                    icd11Code: "FA00",
                    icd11Title: "Osteoarthritis of knee joints",
                    confidence: 92,
                    status: "Verified",
                    diagnosedDate: "16 Aug 2026",
                    doctor: "Dr. Vikram Sharma"
                }
            ],
            encounters: [
                {
                    id: "ENC-8790",
                    date: "16 Aug 2026",
                    type: "Ortho-Ayush Consultation",
                    doctor: "Dr. Vikram Sharma",
                    chiefComplaint: "Bilateral knee joint pain, stiffness during morning hours, crepitus on climbing stairs.",
                    ayushDiagnosis: "Sandhivata",
                    icd11Mapping: "FA00 - Osteoarthritis of joint",
                    confidence: 92,
                    status: "Verified",
                    notes: "Bilateral joint space narrowing on X-Ray. Janu Basti and Yograj Guggulu prescribed.",
                    prescription: [
                        { name: "Yograj Guggulu", dose: "2 tabs", freq: "BD after meals", duration: "30 days", type: "Ayurvedic formulation" },
                        { name: "Mahanarayana Taila (External)", dose: "Local application", freq: "BD", duration: "30 days", type: "Topical Oil" }
                    ]
                }
            ],
            reports: [
                { title: "Bilateral Knee X-Ray (AP/Lateral)", date: "12 Aug 2026", type: "Radiology", doctor: "Narayana Imaging", status: "Grade II Osteoarthritis changes" }
            ]
        },
        {
            id: "P003",
            abhaId: "91-3310-4491-0022",
            name: "Mohit Verma",
            age: 51,
            gender: "Male",
            bloodGroup: "A+",
            phone: "+91 97171 88299",
            address: "C-12, Green Park Main, New Delhi",
            lastVisit: "10 Aug 2026",
            status: "Completed",
            allergies: ["None"],
            vitals: {
                bp: "130/84 mmHg",
                pulse: "72 bpm",
                temp: "98.6 °F",
                bmi: "25.8 kg/m²"
            },
            activeConditions: [
                {
                    ayushTerm: "Prameha (Madhumeha)",
                    namasteCode: "AYU-KC-PRM-008",
                    icd11Code: "5A11",
                    icd11Title: "Type 2 Diabetes Mellitus",
                    confidence: 91,
                    status: "Verified",
                    diagnosedDate: "10 Aug 2026",
                    doctor: "Dr. Ananya Roy"
                }
            ],
            encounters: [
                {
                    id: "ENC-7812",
                    date: "10 Aug 2026",
                    type: "Metabolic Routine",
                    doctor: "Dr. Ananya Roy",
                    chiefComplaint: "Polyuria, increased thirst, fatigue.",
                    ayushDiagnosis: "Prameha (Madhumeha)",
                    icd11Mapping: "5A11 - Type 2 Diabetes Mellitus",
                    confidence: 91,
                    status: "Verified",
                    notes: "HbA1c is 7.4%. Started Chandraprabha Vati and lifestyle modification.",
                    prescription: [
                        { name: "Chandraprabha Vati", dose: "2 tabs", freq: "BD", duration: "30 days", type: "Ayurvedic formulation" },
                        { name: "Vasant Kusumakar Ras", dose: "1 tab", freq: "OD", duration: "30 days", type: "Ayurvedic formulation" }
                    ]
                }
            ],
            reports: [
                { title: "HbA1c & Fasting Blood Sugar", date: "09 Aug 2026", type: "Lab Report", doctor: "Dr. Lal PathLabs", status: "HbA1c 7.4%, FBS 146 mg/dL" }
            ]
        }
    ],

    // Verification Queue items needing doctor/clinician action
    verificationQueue: [
        {
            id: "MQ-101",
            patientName: "Rahul Kumar",
            patientId: "P001",
            ayushTerm: "Amlapitta",
            namasteCode: "AYU-KC-AML-001",
            system: "Ayurveda",
            icd11Suggested: "DA60 - Gastritis (non-infective acid peptic disease)",
            tm2Code: "TM2.26-0041",
            confidence: 87,
            status: "Pending",
            dateSubmitted: "Today, 10:15 AM",
            doctor: "Dr. Vikram Sharma",
            matchReason: "Semantic overlap in gastric acid eructation, heartburn and mucosal inflammation."
        },
        {
            id: "MQ-102",
            patientName: "Suresh Gupta",
            patientId: "P004",
            ayushTerm: "Humma-e-Yabis (Tbm-e-Yabis)",
            namasteCode: "UNI-AMR-TBM-002",
            system: "Unani",
            icd11Suggested: "1C80 - Unspecified Febrile Illness / Pyrexia",
            tm2Code: "TM2.27-0012",
            confidence: 79,
            status: "Pending",
            dateSubmitted: "Yesterday, 04:40 PM",
            doctor: "Dr. Tariq Ahmed",
            matchReason: "Match based on Unani fever taxonomy mapped to WHO Pyrexia category."
        },
        {
            id: "MQ-103",
            patientName: "Meenakshi Sundaram",
            patientId: "P005",
            ayushTerm: "Kabha Suram",
            namasteCode: "SID-NOI-KAB-001",
            system: "Siddha",
            icd11Suggested: "CA40 - Acute Bronchitis / Respiratory Infection",
            tm2Code: "TM2.28-0044",
            confidence: 84,
            status: "Pending",
            dateSubmitted: "15 Aug 2026",
            doctor: "Dr. K. Swaminathan",
            matchReason: "Matched via Siddha morbidity terminology matrix."
        },
        {
            id: "MQ-104",
            patientName: "Sunita Sharma",
            patientId: "P006",
            ayushTerm: "Kamala (Kosthashrita)",
            namasteCode: "AYU-KC-KML-002",
            system: "Ayurveda",
            icd11Suggested: "DB90 - Hepatic dysfunction / Jaundice",
            tm2Code: "TM2.26-0062",
            confidence: 89,
            status: "Pending",
            dateSubmitted: "14 Aug 2026",
            doctor: "Dr. Vikram Sharma",
            matchReason: "Sclerotic icterus and hyperbilirubinemia alignment."
        }
    ],

    // Developer API Endpoints documentation & live sandbox data
    apiEndpoints: [
        {
            id: "api-1",
            method: "GET",
            path: "/api/v1/terminology/search",
            title: "Search AYUSH Standard Terminology",
            description: "Queries the NAMASTE database for standard terms across Ayurveda, Unani, Siddha, and Sowa-Rigpa by keyword or code.",
            params: [
                { name: "q", type: "string", required: true, description: "Search term e.g., 'Amlapitta' or 'AYU-KC-AML-001'" },
                { name: "system", type: "string", required: false, description: "Filter by system: Ayurveda, Unani, Siddha, Sowa-Rigpa" }
            ],
            sampleRequest: "/api/v1/terminology/search?q=Amlapitta&system=Ayurveda",
            sampleResponse: {
                status: "success",
                code: 200,
                timestamp: "2026-08-17T22:58:43Z",
                count: 1,
                data: [
                    {
                        namasteCode: "AYU-KC-AML-001",
                        termName: "Amlapitta",
                        system: "Ayurveda",
                        category: "Kayachikitsa",
                        description: "Hyperacidity, acid peptic disorder presentation.",
                        icd11Candidate: {
                            code: "DA60",
                            title: "Gastritis",
                            confidenceScore: 0.87
                        }
                    }
                ]
            }
        },
        {
            id: "api-2",
            method: "POST",
            path: "/api/v1/mapping/suggest",
            title: "Generate ICD-11 Dual-Coding Suggestion",
            description: "Submits an AYUSH diagnosis term and clinical presentation to receive AI-boosted ICD-11 & TM-2 candidate mappings with confidence metrics.",
            requestBody: {
                ayushTermCode: "AYU-KC-SND-014",
                termName: "Sandhivata",
                clinicalNotes: "Bilateral knee joint pain, crepitus, morning stiffness."
            },
            sampleResponse: {
                status: "success",
                code: 200,
                mappingId: "MAP-99214",
                suggestedIcd11: {
                    code: "FA00",
                    title: "Osteoarthritis of joint",
                    tm2Code: "TM2.26-0182",
                    confidenceScore: 0.92,
                    matchingModel: "NAMASTE-ICD11-Transformer-v2.1"
                },
                rationale: [
                    "High semantic match with Chapter 26 Traditional Medicine 2 (TM-2 Vata joints)",
                    "Cross-validated with 1,200+ clinician verified historical encounters"
                ]
            }
        },
        {
            id: "api-3",
            method: "PATCH",
            path: "/api/v1/mapping/{id}/verify",
            title: "Clinician Verification Audit API",
            description: "Allows authenticated clinicians to approve, modify, or reject an auto-generated ICD-11 dual-coding mapping.",
            requestBody: {
                mappingId: "MQ-101",
                action: "VERIFY",
                verifiedByDocId: "DOC-9421",
                verificationNote: "Clinical correlation confirmed with Upper GI Endoscopy."
            },
            sampleResponse: {
                status: "success",
                code: 200,
                message: "Mapping MQ-101 verified and persisted to ABDM EHR ledger.",
                auditTrail: {
                    status: "Verified",
                    timestamp: "2026-08-17T22:58:43Z",
                    blockchainTxId: "0x8f19a2e3...b71c"
                }
            }
        },
        {
            id: "api-4",
            method: "POST",
            path: "/api/v1/ehr/encounter",
            title: "Create Dual-Coded EHR Encounter",
            description: "Persists a clinical encounter record containing both AYUSH traditional terminology and WHO ICD-11 standardized code into the patient's EHR.",
            requestBody: {
                patientAbhaId: "91-4820-1192-3011",
                encounterType: "Outpatient Consultation",
                ayushDiagnosisCode: "AYU-KC-AML-001",
                icd11Code: "DA60",
                mappingStatus: "Verified",
                doctorNotes: "Advised diet control and Avipattikar Churna."
            },
            sampleResponse: {
                status: "success",
                code: 201,
                encounterId: "ENC-8821",
                persistedAt: "2026-08-17T22:58:43Z",
                abdmSyncStatus: "SYNCHRONIZED"
            }
        }
    ]
};

window.NAMASTE_DATA = NAMASTE_DATA;