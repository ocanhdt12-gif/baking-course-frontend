import { useInitOnLoaded } from '../hooks/useInitOnLoaded';
import React, { useState, useEffect } from 'react';
import PageTitle from '../components/Shared/PageTitle';
import ProgramCard from '../components/Shared/ProgramCard';
import Pagination from '../components/Shared/Pagination';
import { useSearchParams } from 'react-router-dom';
import { getPrograms } from '../services/api';

const ITEMS_PER_PAGE = 6;

const Program = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const chiefId = searchParams.get('chiefId') || '';

  useEffect(() => {
    setLoading(true);
    const filter = { page: currentPage, limit: ITEMS_PER_PAGE };
    if (chiefId) filter.chiefId = chiefId;

    getPrograms(filter)
      .then(response => {
        setPrograms(response.data || []);
        setTotalPages(response.totalPages || 1);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch programs", err);
        setLoading(false);
      });
  }, [currentPage, chiefId]);

  useInitOnLoaded(loading);

  if (loading) {
    return (
      <div className="text-center" style={{ padding: '150px 0' }}>
        <h2>Loading Programs...</h2>
        <div className="spinner-border" role="status"></div>
      </div>
    );
  }

  const paginatedPrograms = programs;
  const filteredChiefName = chiefId && programs.length > 0 && programs[0].chief ? programs[0].chief.name : null;

  return (
    <>
      <PageTitle 
        title="Programs" 
        breadcrumbs={[{ label: 'Home', link: '/' }, { label: 'Programs' }]} 
      />

			<section className="ls s-pt-90 s-pb-40 s-py-lg-100 c-gutter-30 c-mb-50 c-mb-md-30 program">
				<div className="container">
					<div className="row">
						<div className="d-none d-lg-block divider-20"></div>
            

            
            {paginatedPrograms.length === 0 && !loading && (
              <div className="col-12 text-center">
                <h4>No programs found for this instructor.</h4>
              </div>
            )}

            {paginatedPrograms.map((cls) => (
              <div key={cls.id} className="col-md-6 col-lg-4">
                <ProgramCard cls={cls} />
              </div>
            ))}
						
						<div className="d-none d-lg-block divider-30"></div>
					</div>

          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={(page) => { setCurrentPage(page); window.scrollTo(0, 0); }} 
          />
				</div>
			</section>
    </>
  );
};

export default Program;
