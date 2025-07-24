
import ModernHeader from './ModernHeader';

interface DashboardNavProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleOpenModal: () => void;
}

const DashboardNav: React.FC<DashboardNavProps> = ({ searchQuery, setSearchQuery, handleOpenModal }) => {
  return (
    <ModernHeader 
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      handleOpenModal={handleOpenModal}
    />
  );
};

export default DashboardNav;
