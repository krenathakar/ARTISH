import React from "react";

const partners = [
  {
    name: "1947 Restaurant & Bar",
    logo: "/images/partners/1947-restaurant-bar.jpg",
  },
  {
    name: "Dessert Fusion",
    logo: "/images/partners/dessert-fusion.jpg",
  },
  {
    name: "GJ5",
    logo: "/images/partners/gj5.jpg",
  },
  {
    name: "Gujarat No Rankar",
    logo: "/images/partners/gujarat-no-rankar.png",
  },
  {
    name: "Om Nom",
    logo: "/images/partners/om-nom.jpg",
  },
  {
    name: "Padharo Restaurant",
    logo: "/images/partners/padharo-restaurant.jpg",
  },
  {
    name: "Rajdhani Express",
    logo: "/images/partners/rajdhani-express.jpg",
  },
  {
    name: "Shayona Restaurant",
    logo: "/images/partners/shayona-restaurant.jpg",
  },
];

function PartnerCard({ partner }) {
  return (
    <div className="partner-card">
      <div className="partner-logo">
        <img
          src={partner.logo}
          alt={`${partner.name} logo`}
        />
      </div>
      <span className="partner-name">
        {partner.name}
      </span>
    </div>
  );
}

export default function PartnersSection() {
  return (
    <section className="partners-section">
      {/* Heading */}
      <div className="partners-heading">
        <h2>
          Trusted by businesses across the UK
        </h2>

        <p>
          Proudly supporting restaurants, events and growing brands.
        </p>
      </div>

      {/* Moving area */}
      <div className="partners-window">
        {/* Moving track */}
        <div className="partners-track">
          {/* First set */}
          <div className="partners-group">
            {partners.map((partner) => (
              <PartnerCard
                key={`one-${partner.name}`}
                partner={partner}
              />
            ))}
          </div>

          {/* Exact duplicate */}
          <div className="partners-group">
            {partners.map((partner) => (
              <PartnerCard
                key={`two-${partner.name}`}
                partner={partner}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        /* ================================
           SECTION
        ================================= */

        .partners-section {
          width: 100%;
          overflow: hidden;
          background: #F7F8FA;
          padding: 64px 0;
          border-bottom: 1px solid #E2E8F0;
        }

        /* ================================
           HEADING
        ================================= */

        .partners-heading {
          text-align: center;
          padding: 0 20px;
        }

        .partners-label {
          display: inline-block;
          padding: 9px 20px;
          border: 1px solid #E2E8F0;
          border-radius: 999px;
          background: #ffffff;
          color: #101946;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.18em;
        }

        .partners-heading h2 {
          margin: 16px 0 0;
          color: #101946;
          font-size: 38px;
          font-weight: 700;
          line-height: 1.2;
        }

        .partners-heading p {
          margin-top: 10px;
          color: #64748B;
          font-size: 16px;
        }

        /* ================================
           MOVING WINDOW
        ================================= */

        .partners-window {
          width: 100%;
          overflow: hidden;
          margin-top: 48px;
          position: relative;
        }

        /* ================================
           MOVING TRACK
        ================================= */

        .partners-track {
          display: flex;
          width: max-content;
          animation-name: partnersMoving;
          animation-duration: 18s;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }

        /* ================================
           GROUP
        ================================= */

        .partners-group {
          display: flex;
          align-items: center;
          gap: 56px;
          padding-right: 56px;
          flex-shrink: 0;
        }

        /* ================================
           CARD
        ================================= */

        .partner-card {
          display: flex;
          align-items: center;
          gap: 14px;
          height: 60px;
          min-width: 220px;
          padding: 0 24px;
          flex-shrink: 0;
          background: #ffffff;
          border: 1px solid #E2E8F0;
          border-radius: 18px;
          box-shadow: 0 3px 12px rgba(16, 25, 70, 0.05);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .partner-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(16, 25, 70, 0.10);
        }

        /* ================================
           LOGO
        ================================= */

        .partner-logo {
          width: 48px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          overflow: hidden;
          border-radius: 8px;
          background: #ffffff;
        }

        .partner-logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }

        /* ================================
           NAME
        ================================= */

        .partner-name {
          white-space: nowrap;
          color: #101946;
          font-size: 16px;
          font-weight: 600;
        }

        /* ================================
           CONTINUOUS MOVEMENT
        ================================= */

        @keyframes partnersMoving {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        /* ================================
           MOBILE
        ================================= */

        @media (max-width: 768px) {
          .partners-section {
            padding: 50px 0;
          }

          .partners-heading h2 {
            font-size: 28px;
          }

          .partners-heading p {
            font-size: 14px;
          }

          .partners-group {
            gap: 32px;
            padding-right: 32px;
          }

          .partner-card {
            min-width: 190px;
            height: 56px;
            padding: 0 18px;
          }

          .partner-name {
            font-size: 14px;
          }

          .partner-logo {
            width: 42px;
            height: 38px;
          }

          .partners-track {
            animation-duration: 14s;
          }
        }
      `}</style>
    </section>
  );
}