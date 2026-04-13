import React, { useState, useEffect } from 'react';
import HomeSlider from '../components/Home/HomeSlider';
import HomeClasses from '../components/Home/HomeClasses';
import HomeAbout from '../components/Home/HomeAbout';
import TestimonialsSlider from '../components/Shared/TestimonialsSlider';
import HomeTimetables from '../components/Home/HomeTimetables';
import HomeFaq from '../components/Home/HomeFaq';
import HomeChiefs from '../components/Home/HomeChiefs';
import HomeContacts from '../components/Home/HomeContacts';
import HomeBlog from '../components/Home/HomeBlog';
import { getUpcomingPrograms, getPrograms, getChiefs, getPosts, getTestimonials, getTimetables } from '../services/api';

const Home = () => {
  const [data, setData] = useState({
    upcomingSlides: [],
    programs: [],
    chiefs: [],
    posts: [],
    testimonials: [],
    timetables: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getUpcomingPrograms(3),
      getPrograms(),
      getChiefs(),
      getPosts(),
      getTestimonials(),
      getTimetables()
    ]).then(([upcomingRes, programsRes, chiefsRes, postsRes, testimonialsRes, timetablesRes]) => {
      // programsRes is an object with { data, totalPages... } because we paginate in backend now
      const allPrograms = programsRes?.data || programsRes || [];
      const now = new Date();
      const validFeatured = allPrograms
        .filter(p => p.isFeatured && p.startDate && new Date(p.startDate) > now)
        .slice(0, 3);
      
      setData({
        upcomingSlides: validFeatured.length > 0 ? validFeatured : upcomingRes,
        programs: allPrograms,
        chiefs: chiefsRes?.data || chiefsRes || [],
        posts: postsRes?.data || postsRes || [],
        testimonials: testimonialsRes?.data || testimonialsRes || [],
        timetables: timetablesRes?.data || timetablesRes || []
      });
      setLoading(false);
    }).catch(err => {
      console.error("Failed to fetch home data", err);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="text-center" style={{ padding: '150px 0' }}>
        <h2>Loading Bakery Data...</h2>
        <div className="spinner-border" role="status"></div>
      </div>
    );
  }

  return (
    <>
      <HomeSlider slides={data.upcomingSlides} />
      <HomeClasses classes={data.programs} />
      <HomeAbout />
      <TestimonialsSlider testimonials={data.testimonials} />
      <HomeTimetables schedules={data.timetables} />
      <HomeFaq />
      <HomeChiefs chiefs={data.chiefs} />
      <HomeContacts />
      <HomeBlog posts={data.posts} />
    </>
  );
};

export default Home;
