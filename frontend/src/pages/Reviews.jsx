import React from 'react';
import { Star, MessageSquare, ThumbsUp } from 'lucide-react';
import './Reviews.css';

const Reviews = () => {
  const reviews = [
    { name: 'Amit Kumar', rating: 5, date: 'Oct 22, 2023', comment: 'Excellent service! Very professional and helpful. Highly recommended.', service: 'Full Vehicle Service' },
    { name: 'Sneha Roy', rating: 4, date: 'Oct 20, 2023', comment: 'Good work, but took a bit longer than expected.', service: 'Oil Change' },
    { name: 'Vikram Singh', rating: 5, date: 'Oct 15, 2023', comment: 'Top-notch quality. My car feels like new.', service: 'Engine Repair' },
  ];

  return (
    <div className="reviews-page">
      <header className="page-header">
        <div className="header-text">
          <h2>Customer Reviews</h2>
          <p>What customers are saying about your services.</p>
        </div>
        <div className="overall-rating-badge">
          <Star fill="#F59E0B" color="#F59E0B" size={24} />
          <span className="rating-val">4.8</span>
          <span className="rating-count">(124 Reviews)</span>
        </div>
      </header>

      <div className="reviews-list">
        {reviews.map((rev, idx) => (
          <div key={idx} className="review-card">
            <div className="review-header">
              <div className="user-info-row">
                <img src={`https://ui-avatars.com/api/?name=${rev.name}&background=random`} alt="User" />
                <div className="u-meta">
                  <span className="u-name">{rev.name}</span>
                  <span className="u-date">{rev.date}</span>
                </div>
              </div>
              <div className="stars-row">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < rev.rating ? "#F59E0B" : "none"} color="#F59E0B" />
                ))}
              </div>
            </div>
            <div className="service-tag">{rev.service}</div>
            <p className="review-text">"{rev.comment}"</p>
            <div className="review-footer">
              <button className="review-action-btn"><ThumbsUp size={16} /> Helpful</button>
              <button className="review-action-btn"><MessageSquare size={16} /> Reply</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
