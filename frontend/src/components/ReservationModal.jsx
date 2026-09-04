import { useState } from "react";
import "./ReservationModal.css";

const API_BASE = "https://ar-heritage-platform.onrender.com/api";

const ReservationModal = ({
  site,
  user,
  onClose,
  onReserved,
}) => {
  const [visitDate, setVisitDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("10:00 AM - 11:00 AM");
  const [seats, setSeats] = useState(1);

  const [visitorName, setVisitorName] = useState(
    user?.name || ""
  );

  const [visitorEmail, setVisitorEmail] = useState(
    user?.email || ""
  );

  const [visitorPhone, setVisitorPhone] = useState("");

  const [specialRequest, setSpecialRequest] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("authToken")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!visitDate) {
      setError("Please select your visit date.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE}/reservations`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },

          body: JSON.stringify({
            siteId: String(site.id),
            siteName: site.name,
            siteImage: site.image || "",

            visitDate,
            timeSlot,
            seats,

            visitorName,
            visitorEmail,
            visitorPhone,
            specialRequest,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to reserve your visit."
        );
      }

      onReserved?.(data.reservation);

      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reservation-overlay">
      <div className="reservation-modal">

        <button
          className="reservation-close"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="reservation-header">
          <div className="reservation-kicker">
            HERITAGE EXPERIENCE
          </div>

          <h2>Reserve Your Visit</h2>

          <p>
            Secure your place and experience
            India's heritage up close.
          </p>
        </div>

        <div className="reservation-site-card">
          {site.image && (
            <img
              src={site.image}
              alt={site.name}
            />
          )}

          <div>
            <span>Your destination</span>

            <h3>{site.name}</h3>

            <p>
              {site.location ||
                site.state ||
                "India"}
            </p>
          </div>
        </div>

        <form
          className="reservation-form"
          onSubmit={handleSubmit}
        >

          <div className="reservation-grid">

            <div className="reservation-field">
              <label>Visit Date</label>

              <input
                type="date"
                value={visitDate}
                min={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
                onChange={(e) =>
                  setVisitDate(e.target.value)
                }
                required
              />
            </div>

            <div className="reservation-field">
              <label>Time Slot</label>

              <select
                value={timeSlot}
                onChange={(e) =>
                  setTimeSlot(e.target.value)
                }
              >
                <option>
                  09:00 AM - 10:00 AM
                </option>

                <option>
                  10:00 AM - 11:00 AM
                </option>

                <option>
                  11:00 AM - 12:00 PM
                </option>

                <option>
                  12:00 PM - 01:00 PM
                </option>

                <option>
                  02:00 PM - 03:00 PM
                </option>

                <option>
                  03:00 PM - 04:00 PM
                </option>

                <option>
                  04:00 PM - 05:00 PM
                </option>
              </select>
            </div>

          </div>

          <div className="reservation-field">
            <label>Number of Visitors</label>

            <div className="seat-selector">

              <button
                type="button"
                onClick={() =>
                  setSeats((prev) =>
                    Math.max(1, prev - 1)
                  )
                }
              >
                −
              </button>

              <strong>
                {seats}
              </strong>

              <button
                type="button"
                onClick={() =>
                  setSeats((prev) =>
                    Math.min(10, prev + 1)
                  )
                }
              >
                +
              </button>

            </div>
          </div>

          <div className="reservation-grid">

            <div className="reservation-field">
              <label>Visitor Name</label>

              <input
                type="text"
                value={visitorName}
                onChange={(e) =>
                  setVisitorName(e.target.value)
                }
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="reservation-field">
              <label>Email Address</label>

              <input
                type="email"
                value={visitorEmail}
                onChange={(e) =>
                  setVisitorEmail(e.target.value)
                }
                placeholder="Enter your email"
                required
              />
            </div>

          </div>

          <div className="reservation-field">
            <label>
              Phone Number
              <span>Optional</span>
            </label>

            <input
              type="tel"
              value={visitorPhone}
              onChange={(e) =>
                setVisitorPhone(e.target.value)
              }
              placeholder="+91"
            />
          </div>

          <div className="reservation-field">
            <label>
              Special Request
              <span>Optional</span>
            </label>

            <textarea
              value={specialRequest}
              onChange={(e) =>
                setSpecialRequest(e.target.value)
              }
              placeholder="Any accessibility or visit requirements?"
              rows="3"
            />
          </div>

          {error && (
            <div className="reservation-error">
              {error}
            </div>
          )}

          <button
            className="reservation-submit"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Reserving..."
              : `Confirm Reservation · ${seats} ${
                  seats === 1
                    ? "Visitor"
                    : "Visitors"
                }`}
          </button>

        </form>
      </div>
    </div>
  );
};

export default ReservationModal;