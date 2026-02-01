# 🔌 Brand Verification API Integration Guide

## Overview
This guide provides frontend developers with the API endpoints structure needed to complete the brand verification system backend integration.

## API Endpoints

### 1. Submit Brand Verification Request

**Endpoint**: `POST /api/v1/brands/{brandId}/verification/submit`

**Authentication**: Bearer Token (Brand account)

**Request Body**:
```javascript
{
  "companyRegistration": "RCS Paris 123456789",
  "taxNumber": "12345678901234",
  "officialWebsite": "https://maison-atelier.com",
  "legalRepresentative": "Jean Dupont",
  "businessLicense": File,           // Multipart form
  "addressProof": File               // Multipart form
}
```

**Response** (200 OK):
```javascript
{
  "id": 1,
  "brandId": 5,
  "status": "pending",
  "submittedAt": "2026-01-28T14:30:00Z",
  "companyRegistration": "RCS Paris 123456789",
  "taxNumber": "12345678901234",
  "officialWebsite": "https://maison-atelier.com",
  "legalRepresentative": "Jean Dupont",
  "documents": {
    "businessLicense": "storage_url_hash_1",
    "addressProof": "storage_url_hash_2"
  },
  "message": "Votre demande de vérification a été soumise avec succès."
}
```

**Error Responses**:
- `400 Bad Request`: Missing required fields
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not a brand account
- `409 Conflict`: Brand already has pending/verified verification

---

### 2. Get Brand Verification Status

**Endpoint**: `GET /api/v1/brands/{brandId}/verification/status`

**Authentication**: Bearer Token (Brand account or Admin)

**Response** (200 OK):
```javascript
{
  "id": 1,
  "brandId": 5,
  "status": "pending",  // or "verified", "rejected", "not_started"
  "submittedAt": "2026-01-28T14:30:00Z",
  "verifiedAt": null,   // Populated when approved
  "rejectedAt": null,   // Populated when rejected
  "rejectionReason": null,
  "documents": [
    "businessLicense",
    "addressProof"
  ]
}
```

---

### 3. Get All Pending Verifications (Admin Only)

**Endpoint**: `GET /api/v1/admin/brand-verifications`

**Authentication**: Bearer Token (community_admin or system_admin)

**Query Parameters**:
- `status`: "pending" | "verified" | "rejected" (optional)
- `page`: number (default: 1)
- `limit`: number (default: 10)

**Response** (200 OK):
```javascript
{
  "data": [
    {
      "id": 1,
      "brandId": 5,
      "brandName": "Maison Atelier",
      "email": "contact@maison-atelier.com",
      "status": "pending",
      "submittedAt": "2026-01-28T14:30:00Z",
      "companyRegistration": "RCS Paris 123456789",
      "taxNumber": "12345678901234",
      "officialWebsite": "https://maison-atelier.com",
      "legalRepresentative": "Jean Dupont",
      "documents": ["businessLicense", "addressProof"]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

---

### 4. Approve Brand Verification (Admin)

**Endpoint**: `PATCH /api/v1/admin/brand-verifications/{verificationId}/approve`

**Authentication**: Bearer Token (community_admin or system_admin)

**Request Body**:
```javascript
{
  "notes": "Documents verified successfully"  // Optional
}
```

**Response** (200 OK):
```javascript
{
  "id": 1,
  "brandId": 5,
  "status": "verified",
  "verifiedAt": "2026-01-28T16:45:00Z",
  "verifiedByAdminId": 2,
  "notes": "Documents verified successfully",
  "message": "Brand verification approved successfully."
}
```

**Side Effects**:
- Update `brands.verification_status` to "verified"
- Unlock brand features (messaging, announcements, etc.)
- Send verification approval email to brand

---

### 5. Reject Brand Verification (Admin)

**Endpoint**: `PATCH /api/v1/admin/brand-verifications/{verificationId}/reject`

**Authentication**: Bearer Token (community_admin or system_admin)

**Request Body**:
```javascript
{
  "rejectionReason": "Documents incomplets. Justificatif d'adresse manquant.",
  "allowResubmit": true  // Optional, default: true
}
```

**Response** (200 OK):
```javascript
{
  "id": 1,
  "brandId": 5,
  "status": "rejected",
  "rejectedAt": "2026-01-28T17:00:00Z",
  "rejectionReason": "Documents incomplets. Justificatif d'adresse manquant.",
  "allowResubmit": true,
  "message": "Brand verification rejected."
}
```

**Side Effects**:
- Update `brands.verification_status` to "rejected"
- Keep previous documents for review
- Send rejection email with reason to brand
- Allow resubmission if `allowResubmit = true`

---

### 6. Get Verification Statistics (Admin)

**Endpoint**: `GET /api/v1/admin/brand-verifications/stats`

**Authentication**: Bearer Token (community_admin or system_admin)

**Response** (200 OK):
```javascript
{
  "totalRequests": 48,
  "pending": {
    "count": 5,
    "averageWaitTime": "2.3 days"
  },
  "verified": {
    "count": 40,
    "approvalRate": "83.3%"
  },
  "rejected": {
    "count": 3,
    "rejectionRate": "6.3%"
  },
  "recentApprovals": [
    {
      "brandName": "Studio Polaris",
      "approvedAt": "2026-01-26T16:45:00Z"
    }
  ]
}
```

---

## Frontend Integration Points

### BrandVerification Component

The component needs these API calls added:

```javascript
// 1. Submit verification (in handleSubmitVerification)
const submitVerification = async () => {
  const formData = new FormData();
  formData.append('companyRegistration', verificationData.companyRegistration);
  formData.append('taxNumber', verificationData.taxNumber);
  formData.append('officialWebsite', verificationData.officialWebsite);
  formData.append('legalRepresentative', verificationData.legalRepresentative);
  formData.append('businessLicense', verificationData.businessLicense);
  formData.append('addressProof', verificationData.addressProof);

  const response = await fetch(`/api/v1/brands/${user.id}/verification/submit`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  if (response.ok) {
    const data = await response.json();
    onUpdate({
      ...brandProfile,
      verificationStatus: 'pending',
      verificationData,
      submittedAt: data.submittedAt
    });
  }
};

// 2. Load verification status on mount
useEffect(() => {
  const loadStatus = async () => {
    const response = await fetch(`/api/v1/brands/${user.id}/verification/status`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.ok) {
      const data = await response.json();
      onUpdate(prev => ({
        ...prev,
        verificationStatus: data.status,
        submittedAt: data.submittedAt
      }));
    }
  };
  
  if (user?.id) loadStatus();
}, [user?.id]);
```

### SalesforceAdminDashboard Component

```javascript
// 1. Load pending verifications
const loadPendingVerifications = async () => {
  const response = await fetch('/api/v1/admin/brand-verifications?status=pending', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (response.ok) {
    const data = await response.json();
    setBrandVerifications(data.data);
  }
};

// 2. Approve verification
const handleVerifyBrand = async (verificationId) => {
  const response = await fetch(
    `/api/v1/admin/brand-verifications/${verificationId}/approve`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ notes: 'Approved by admin' })
    }
  );
  
  if (response.ok) {
    await loadPendingVerifications(); // Refresh list
  }
};

// 3. Reject verification
const handleRejectBrand = async (verificationId, reason) => {
  const response = await fetch(
    `/api/v1/admin/brand-verifications/${verificationId}/reject`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        rejectionReason: reason,
        allowResubmit: true
      })
    }
  );
  
  if (response.ok) {
    await loadPendingVerifications(); // Refresh list
  }
};
```

---

## Database Schema (Recommended)

```sql
-- Brand verification requests table
CREATE TABLE brand_verifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  brand_id INT NOT NULL UNIQUE,
  company_registration VARCHAR(50) NOT NULL,
  tax_number VARCHAR(20) NOT NULL,
  official_website VARCHAR(255) NOT NULL,
  legal_representative VARCHAR(100) NOT NULL,
  business_license_path VARCHAR(255),
  address_proof_path VARCHAR(255),
  status ENUM('not_started', 'pending', 'verified', 'rejected') DEFAULT 'not_started',
  verification_notes TEXT,
  rejection_reason TEXT,
  allow_resubmit BOOLEAN DEFAULT TRUE,
  submitted_at TIMESTAMP NULL,
  verified_at TIMESTAMP NULL,
  rejected_at TIMESTAMP NULL,
  verified_by_admin_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (brand_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (verified_by_admin_id) REFERENCES users(id) ON DELETE SET NULL,
  
  INDEX idx_status (status),
  INDEX idx_brand_id (brand_id),
  INDEX idx_submitted_at (submitted_at)
);

-- Update brands table to track verification status
ALTER TABLE users ADD COLUMN verification_status 
  ENUM('not_started', 'pending', 'verified', 'rejected') DEFAULT 'not_started'
  AFTER account_type;

-- Audit log for verification actions
CREATE TABLE verification_audit_log (
  id INT PRIMARY KEY AUTO_INCREMENT,
  verification_id INT NOT NULL,
  admin_id INT NOT NULL,
  action VARCHAR(50) NOT NULL,  -- 'submitted', 'approved', 'rejected'
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (verification_id) REFERENCES brand_verifications(id),
  FOREIGN KEY (admin_id) REFERENCES users(id),
  
  INDEX idx_verification_id (verification_id)
);
```

---

## Error Handling

### Frontend Error Handling Example

```javascript
const handleSubmitVerification = async () => {
  try {
    // Validation
    const requiredFields = [...];
    if (missingFields.length > 0) {
      throw new Error(`Champs obligatoires manquants: ${missingFields.join(', ')}`);
    }

    // API Call
    const formData = new FormData();
    // ... append fields

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });

    // Error responses
    if (!response.ok) {
      const error = await response.json();
      switch (response.status) {
        case 400:
          throw new Error(`Erreur: ${error.message}`);
        case 409:
          throw new Error('Une demande de vérification est déjà en cours.');
        case 401:
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        default:
          throw new Error('Erreur serveur. Veuillez réessayer.');
      }
    }

    // Success
    const data = await response.json();
    onUpdate({ ...brandProfile, verificationStatus: 'pending' });
    
  } catch (error) {
    console.error('Verification submission failed:', error);
    alert(error.message);
  }
};
```

---

## Testing Endpoints

### Using cURL

```bash
# Submit verification
curl -X POST http://localhost:8100/api/v1/brands/5/verification/submit \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "companyRegistration=RCS Paris 123456789" \
  -F "taxNumber=12345678901234" \
  -F "officialWebsite=https://maison-atelier.com" \
  -F "legalRepresentative=Jean Dupont" \
  -F "businessLicense=@kbis.pdf" \
  -F "addressProof=@address.pdf"

# Get pending verifications
curl -X GET http://localhost:8100/api/v1/admin/brand-verifications?status=pending \
  -H "Authorization: Bearer ADMIN_TOKEN"

# Approve verification
curl -X PATCH http://localhost:8100/api/v1/admin/brand-verifications/1/approve \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"notes": "Verified"}'

# Reject verification
curl -X PATCH http://localhost:8100/api/v1/admin/brand-verifications/1/reject \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"rejectionReason": "Documents incomplets"}'
```

---

## Security Considerations

1. **File Upload Validation**:
   - Check file types (PDF, DOCX only)
   - Limit file size (max 10MB per file)
   - Scan files for malware

2. **Access Control**:
   - Only authenticated brand accounts can submit
   - Only admins can approve/reject
   - Verify user owns the brand account

3. **Data Privacy**:
   - Encrypt files at rest
   - Use secure temporary URLs for downloads
   - Log all admin access to documents
   - Auto-delete documents after N days of rejection

4. **Rate Limiting**:
   - Limit submission to 1 per brand per month
   - Prevent resubmission within 24 hours
   - Admin approval/rejection: no rate limit

---

## Implementation Timeline

**Phase 1** (Week 1):
- Implement database schema
- Create basic API endpoints
- Add file storage integration

**Phase 2** (Week 2):
- Integrate frontend API calls
- Add error handling
- Email notifications

**Phase 3** (Week 3):
- Automated validation
- RCS/SIREN lookup
- Analytics dashboard

---

**Last Updated**: February 1, 2026
**Frontend Status**: ✅ Ready for API integration
**Backend Status**: ⏳ To be implemented
