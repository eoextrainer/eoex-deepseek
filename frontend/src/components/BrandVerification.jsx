import React, { useState } from 'react';

export default function BrandVerification({ user, brandProfile, onUpdate }) {
  const [verificationData, setVerificationData] = useState({
    companyRegistration: '',
    taxNumber: '',
    officialWebsite: '',
    businessLicense: null,
    legalRepresentative: '',
    addressProof: null,
  });
  const [uploadProgress, setUploadProgress] = useState({
    businessLicense: 0,
    addressProof: 0,
  });

  const handleInputChange = (field, value) => {
    setVerificationData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = async (field, file) => {
    if (!file) return;

    // Simulate file upload progress
    for (let i = 0; i <= 100; i += 20) {
      setUploadProgress((prev) => ({
        ...prev,
        [field]: i,
      }));
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    setVerificationData((prev) => ({
      ...prev,
      [field]: file.name,
    }));
  };

  const handleSubmitVerification = async () => {
    const requiredFields = [
      'companyRegistration',
      'taxNumber',
      'officialWebsite',
      'businessLicense',
      'legalRepresentative',
      'addressProof',
    ];

    const missingFields = requiredFields.filter((field) => !verificationData[field]);
    if (missingFields.length > 0) {
      alert(`Veuillez compléter les champs obligatoires: ${missingFields.join(', ')}`);
      return;
    }

    onUpdate({
      ...brandProfile,
      verificationStatus: 'pending',
      verificationData,
      submittedAt: new Date().toISOString(),
    });

    alert('Votre demande de vérification a été soumise avec succès. Notre équipe examinera vos documents sous 48-72 heures.');
  };

  const getVerificationStatusColor = (status) => {
    const colors = {
      verified: '#22c55e',
      pending: '#f59e0b',
      rejected: '#ef4444',
      not_started: '#6b7280',
    };
    return colors[status] || '#6b7280';
  };

  const verificationStatus = brandProfile.verificationStatus || 'not_started';

  return (
    <div className="mb-12 p-8 rounded-lg border-2" style={{
      backgroundColor: 'var(--secondary-color)',
      borderColor: getVerificationStatusColor(verificationStatus),
      borderWidth: '2px',
    }}>
      {/* Verification Status Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>
            🛡️ Vérification de Compte Marque
          </h2>
          <p className="text-sm mt-2" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
            Vérifiez votre compte pour accéder aux fonctionnalités complètes et gagner la confiance des talents.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className="px-4 py-2 rounded text-xs font-semibold text-white"
            style={{ backgroundColor: getVerificationStatusColor(verificationStatus) }}
          >
            {verificationStatus === 'verified' && '✅ Vérifié'}
            {verificationStatus === 'pending' && '⏳ En attente'}
            {verificationStatus === 'rejected' && '❌ Rejeté'}
            {verificationStatus === 'not_started' && '📋 Non démarré'}
          </span>
          {verificationStatus === 'pending' && (
            <p className="text-xs" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
              Délai: 48-72 heures
            </p>
          )}
        </div>
      </div>

      {/* Status Messages */}
      {verificationStatus === 'verified' && (
        <div
          className="mb-6 p-4 rounded border-l-4"
          style={{
            backgroundColor: 'color-mix(in srgb, #22c55e 10%, transparent)',
            borderColor: '#22c55e',
          }}
        >
          <p style={{ color: '#22c55e', fontWeight: 'bold' }}>
            ✅ Votre compte a été vérifié avec succès. Tous les privilèges sont activés.
          </p>
        </div>
      )}

      {verificationStatus === 'pending' && (
        <div
          className="mb-6 p-4 rounded border-l-4"
          style={{
            backgroundColor: 'color-mix(in srgb, #f59e0b 10%, transparent)',
            borderColor: '#f59e0b',
          }}
        >
          <p style={{ color: '#f59e0b', fontWeight: 'bold' }}>
            ⏳ Votre demande de vérification est en cours d'examen. Nous vous confirmerons dès que possible.
          </p>
        </div>
      )}

      {verificationStatus === 'rejected' && (
        <div
          className="mb-6 p-4 rounded border-l-4"
          style={{
            backgroundColor: 'color-mix(in srgb, #ef4444 10%, transparent)',
            borderColor: '#ef4444',
          }}
        >
          <p style={{ color: '#ef4444', fontWeight: 'bold' }}>
            ❌ Votre demande a été rejetée. Veuillez contacter notre équipe de support pour plus de détails.
          </p>
        </div>
      )}

      {/* Required Information Section */}
      {verificationStatus !== 'verified' && (
        <>
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-color)' }}>
              📋 Informations Obligatoires
            </h3>
            <p className="text-sm mb-6" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
              Tous les champs marqués avec * sont obligatoires pour la vérification manuelle.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company Registration */}
              <div>
                <label className="text-sm font-semibold" style={{ color: 'var(--text-color)', opacity: 0.8 }}>
                  Numéro d'immatriculation au Registre du Commerce *
                </label>
                <input
                  type="text"
                  value={verificationData.companyRegistration}
                  onChange={(e) => handleInputChange('companyRegistration', e.target.value)}
                  placeholder="Ex: RCS Paris 123456789"
                  className="w-full mt-2 p-3 rounded bg-black text-white border"
                  style={{ borderColor: 'color-mix(in srgb, var(--text-color) 15%, transparent)' }}
                  disabled={verificationStatus === 'verified'}
                />
              </div>

              {/* Tax Number */}
              <div>
                <label className="text-sm font-semibold" style={{ color: 'var(--text-color)', opacity: 0.8 }}>
                  Numéro de SIRET/SIREN *
                </label>
                <input
                  type="text"
                  value={verificationData.taxNumber}
                  onChange={(e) => handleInputChange('taxNumber', e.target.value)}
                  placeholder="Ex: 12345678901234"
                  className="w-full mt-2 p-3 rounded bg-black text-white border"
                  style={{ borderColor: 'color-mix(in srgb, var(--text-color) 15%, transparent)' }}
                  disabled={verificationStatus === 'verified'}
                />
              </div>

              {/* Official Website */}
              <div>
                <label className="text-sm font-semibold" style={{ color: 'var(--text-color)', opacity: 0.8 }}>
                  Site officiel de la marque *
                </label>
                <input
                  type="url"
                  value={verificationData.officialWebsite}
                  onChange={(e) => handleInputChange('officialWebsite', e.target.value)}
                  placeholder="https://www.marque.com"
                  className="w-full mt-2 p-3 rounded bg-black text-white border"
                  style={{ borderColor: 'color-mix(in srgb, var(--text-color) 15%, transparent)' }}
                  disabled={verificationStatus === 'verified'}
                />
              </div>

              {/* Legal Representative */}
              <div>
                <label className="text-sm font-semibold" style={{ color: 'var(--text-color)', opacity: 0.8 }}>
                  Représentant légal de la structure *
                </label>
                <input
                  type="text"
                  value={verificationData.legalRepresentative}
                  onChange={(e) => handleInputChange('legalRepresentative', e.target.value)}
                  placeholder="Nom complet du gérant/PDG"
                  className="w-full mt-2 p-3 rounded bg-black text-white border"
                  style={{ borderColor: 'color-mix(in srgb, var(--text-color) 15%, transparent)' }}
                  disabled={verificationStatus === 'verified'}
                />
              </div>
            </div>
          </div>

          {/* Document Upload Section */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-color)' }}>
              📄 Documents à Joindre
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Business License */}
              <div
                className="p-6 rounded-lg border-2 border-dashed cursor-pointer transition"
                style={{
                  borderColor: 'color-mix(in srgb, var(--primary-color) 40%, transparent)',
                  backgroundColor: 'color-mix(in srgb, var(--primary-color) 5%, transparent)',
                }}
              >
                <input
                  type="file"
                  accept="application/pdf,.pdf,.doc,.docx"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleFileUpload('businessLicense', e.target.files[0]);
                    }
                  }}
                  className="hidden"
                  id="businessLicense"
                  disabled={verificationStatus === 'verified'}
                />
                <label htmlFor="businessLicense" className="block cursor-pointer">
                  <p className="font-semibold" style={{ color: 'var(--text-color)' }}>
                    📋 Extrait Kbis ou Licence d'activité *
                  </p>
                  <p className="text-sm mt-2" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                    Document officiel prouvant l'existence légale
                  </p>
                  {verificationData.businessLicense && (
                    <p className="text-sm mt-2" style={{ color: '#22c55e' }}>
                      ✅ {verificationData.businessLicense}
                    </p>
                  )}
                  {uploadProgress.businessLicense > 0 && uploadProgress.businessLicense < 100 && (
                    <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition"
                        style={{
                          width: `${uploadProgress.businessLicense}%`,
                          backgroundColor: 'var(--primary-color)',
                        }}
                      />
                    </div>
                  )}
                </label>
              </div>

              {/* Address Proof */}
              <div
                className="p-6 rounded-lg border-2 border-dashed cursor-pointer transition"
                style={{
                  borderColor: 'color-mix(in srgb, var(--primary-color) 40%, transparent)',
                  backgroundColor: 'color-mix(in srgb, var(--primary-color) 5%, transparent)',
                }}
              >
                <input
                  type="file"
                  accept="application/pdf,.pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleFileUpload('addressProof', e.target.files[0]);
                    }
                  }}
                  className="hidden"
                  id="addressProof"
                  disabled={verificationStatus === 'verified'}
                />
                <label htmlFor="addressProof" className="block cursor-pointer">
                  <p className="font-semibold" style={{ color: 'var(--text-color)' }}>
                    🏢 Justificatif d'adresse *
                  </p>
                  <p className="text-sm mt-2" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                    Facture, bail ou document officiel avec adresse
                  </p>
                  {verificationData.addressProof && (
                    <p className="text-sm mt-2" style={{ color: '#22c55e' }}>
                      ✅ {verificationData.addressProof}
                    </p>
                  )}
                  {uploadProgress.addressProof > 0 && uploadProgress.addressProof < 100 && (
                    <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition"
                        style={{
                          width: `${uploadProgress.addressProof}%`,
                          backgroundColor: 'var(--primary-color)',
                        }}
                      />
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div
            className="mb-6 p-4 rounded border-l-4"
            style={{
              backgroundColor: 'color-mix(in srgb, #3b82f6 10%, transparent)',
              borderColor: '#3b82f6',
            }}
          >
            <p style={{ color: '#3b82f6', fontSize: '0.875rem' }}>
              <strong>🔒 Sécurité:</strong> Vos documents sont chiffrés et traitées uniquement par notre équipe de vérification. Aucune donnée n'est partagée avec d'autres utilisateurs.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              onClick={handleSubmitVerification}
              className="flex-1 px-6 py-3 rounded font-semibold text-white transition hover:opacity-90"
              style={{ backgroundColor: 'var(--primary-color)' }}
              disabled={verificationStatus === 'pending' || verificationStatus === 'verified'}
            >
              {verificationStatus === 'pending'
                ? '⏳ Vérification en cours...'
                : verificationStatus === 'verified'
                  ? '✅ Compte vérifié'
                  : '🚀 Soumettre ma demande de vérification'}
            </button>
          </div>
        </>
      )}

      {/* Verified Benefits */}
      {verificationStatus === 'verified' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded" style={{ backgroundColor: 'color-mix(in srgb, #22c55e 10%, transparent)' }}>
            <p className="font-semibold" style={{ color: '#22c55e' }}>✅ Messagerie illimitée</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
              Communiquez avec tous les talents vérifiés
            </p>
          </div>
          <div className="p-4 rounded" style={{ backgroundColor: 'color-mix(in srgb, #22c55e 10%, transparent)' }}>
            <p className="font-semibold" style={{ color: '#22c55e' }}>✅ Annonces prioritaires</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
              Vos annonces apparaissent en haut des recherches
            </p>
          </div>
          <div className="p-4 rounded" style={{ backgroundColor: 'color-mix(in srgb, #22c55e 10%, transparent)' }}>
            <p className="font-semibold" style={{ color: '#22c55e' }}>✅ Badge de vérification</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
              Marque officiellement reconnue par KCD
            </p>
          </div>
          <div className="p-4 rounded" style={{ backgroundColor: 'color-mix(in srgb, #22c55e 10%, transparent)' }}>
            <p className="font-semibold" style={{ color: '#22c55e' }}>✅ Statistiques avancées</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
              Accès aux analytics complètes de vos campagnes
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
