
import ModernHeader from './ModernHeader';

interface DashboardNavProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleOpenModal: () => void;
}

const DashboardNav: React.FC<DashboardNavProps> = ({ searchQuery, setSearchQuery, handleOpenModal }) => {
  return (
    <div className="w-full h-full">
      <ModernHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleOpenModal={handleOpenModal}
      />
    </div>
  );
};

export default DashboardNav;
