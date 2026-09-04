import { useEffect, useState } from "react";
import "./MyReservations.css";

const API_BASE = "https://ar-heritage-platform.onrender.com/api";

const MyReservations = ({ onClose }) => {
  const [reservations, setReservations] =
    useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("authToken")
    );
  };

  const loadReservations = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE}/reservations/my-reservations`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load reservations."
        );
      }

      setReservations(
        data.reservations || []
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const cancelReservation = async (id) => {
    const confirmed = window.confirm(
      "Cancel this reservation?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/reservations/${id}/cancel`,
        {
          method: "PATCH",

          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to cancel reservation."
        );
      }

      setReservations((current) =>
        current.map((reservation) =>
          reservation._id === id
            ? data.reservation
            : reservation
        )
      );
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="my-reservations-overlay">

      <div className="my-reservations-modal">

        <div className="my-reservations-header">

          <div>
            <span>
              BHARATIYA DHAROHAR
            </span>

            <h2>
              My Reservations
            </h2>
          </div>

          <button onClick={onClose}>
            ✕
          </button>

        </div>

        {loading && (
          <div className="reservation-loading">
            Loading your reservations...
          </div>
        )}

        {error && (
          <div className="reservation-loading error">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          reservations.length === 0 && (
            <div className="reservation-empty">
              <div>🏛️</div>

              <h3>
                No reservations yet
              </h3>

              <p>
                Your upcoming heritage visits
                will appear here.
              </p>
            </div>
          )}

        <div className="reservation-list">

          {reservations.map(
            (reservation) => (
              <div
                className="reservation-ticket"
                key={reservation._id}
              >

                <div className="ticket-main">

                  {reservation.siteImage && (
                    <img
                      src={reservation.siteImage}
                      alt={reservation.siteName}
                    />
                  )}

                  <div className="ticket-info">

                    <div className="ticket-code">
                      {reservation.reservationCode}
                    </div>

                    <h3>
                      {reservation.siteName}
                    </h3>

                    <div className="ticket-details">

                      <span>
                        📅{" "}
                        {new Date(
                          reservation.visitDate
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </span>

                      <span>
                        🕒{" "}
                        {reservation.timeSlot}
                      </span>

                      <span>
                        👥{" "}
                        {reservation.seats} Visitors
                      </span>

                    </div>

                  </div>

                </div>

                <div className="ticket-side">

                  <span
                    className={
                      reservation.status ===
                      "confirmed"
                        ? "ticket-status confirmed"
                        : "ticket-status cancelled"
                    }
                  >
                    {reservation.status}
                  </span>

                  {reservation.status ===
                    "confirmed" && (
                    <button
                      onClick={() =>
                        cancelReservation(
                          reservation._id
                        )
                      }
                    >
                      Cancel
                    </button>
                  )}

                </div>

              </div>
            )
          )}

        </div>

      </div>
    </div>
  );
};

export default MyReservations;
