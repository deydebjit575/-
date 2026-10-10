import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { PatientRegistration } from './pages/PatientRegistration';
import { PatientLogin } from './pages/PatientLogin';
import { HospitalLogin } from './pages/HospitalLogin';
import { PatientDashboard } from './pages/PatientDashboard';
import { PersonalProfile } from './pages/PersonalProfile';
import { MedicalVault } from './pages/MedicalVault';
import { UploadMedicalDocument } from './pages/UploadMedicalDocument';
import { DocumentPreviewModal } from './pages/DocumentPreviewModal';
import { MedicalTimeline } from './pages/MedicalTimeline';
import { MedicalSummary } from './pages/MedicalSummary';
import { InsuranceVault } from './pages/InsuranceVault';
import { IdDocumentVault } from './pages/IdDocumentVault';
import { ShareMedicalRecords } from './pages/ShareMedicalRecords';
import { NearbyHospitalFinder } from './pages/NearbyHospitalFinder';
import { EmergencySOS } from './pages/EmergencySOS';
import { EmergencyTracking } from './pages/EmergencyTracking';
import { EmergencyContacts } from './pages/EmergencyContacts';
import { NotificationCentre } from './pages/NotificationCentre';
import { HospitalEmergencyDashboard } from './pages/HospitalEmergencyDashboard';
import { BedAvailabilityManagement } from './pages/BedAvailabilityManagement';
import { AmbulanceCoordination } from './pages/AmbulanceCoordination';
import { AdminDashboard } from './pages/AdminDashboard';
import { PrivacyAndConsentSettings } from './pages/PrivacyAndConsentSettings';
import { HelpAndEmergencyInfo } from './pages/HelpAndEmergencyInfo';
import { AiHealthCheckin } from './pages/AiHealthCheckin';
import { DrugInteractionChecker } from './pages/DrugInteractionChecker';

export const AppContent: React.FC = () => {
  const { currentPage, isLoggedIn } = useApp();

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage />;
      case 'register':
        return <PatientRegistration />;
      case 'login':
        return <PatientLogin />;
      case 'hospital-login':
        return <HospitalLogin />;
      case 'dashboard':
        return isLoggedIn ? <PatientDashboard /> : <PatientLogin />;
      case 'profile':
        return isLoggedIn ? <PersonalProfile /> : <PatientLogin />;
      case 'medical-vault':
        return isLoggedIn ? <MedicalVault /> : <PatientLogin />;
      case 'upload-document':
        return isLoggedIn ? <UploadMedicalDocument /> : <PatientLogin />;
      case 'document-preview':
        return <DocumentPreviewModal />;
      case 'timeline':
        return <MedicalTimeline />;
      case 'medical-summary':
        return <MedicalSummary />;
      case 'insurance-vault':
        return <InsuranceVault />;
      case 'id-vault':
        return <IdDocumentVault />;
      case 'share-records':
        return <ShareMedicalRecords />;
      case 'nearby-hospitals':
        return <NearbyHospitalFinder />;
      case 'ai-checkin':
        return <AiHealthCheckin />;
      case 'drug-checker':
        return <DrugInteractionChecker />;
      case 'emergency-sos':
        return <EmergencySOS />;
      case 'emergency-tracking':
        return <EmergencyTracking />;
      case 'emergency-contacts':
        return <EmergencyContacts />;
      case 'notifications':
        return <NotificationCentre />;
      case 'hospital-dashboard':
        return <HospitalEmergencyDashboard />;
      case 'bed-management':
        return <BedAvailabilityManagement />;
      case 'ambulance-coordination':
        return <AmbulanceCoordination />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'settings':
        return <PrivacyAndConsentSettings />;
      case 'help':
        return <HelpAndEmergencyInfo />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#171717]">
      <Navbar />
      <main className="flex-1">
        {renderCurrentPage()}
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default AppContent;
