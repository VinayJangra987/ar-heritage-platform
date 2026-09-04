import Reservation from "../models/Reservation.js";

const generateReservationCode = () => {
  const random = Math.random()
    .toString(36)
    .substring(2, 7)
    .toUpperCase();

  return `BD-${Date.now()
    .toString()
    .slice(-6)}-${random}`;
};

export const createReservation = async (req, res) => {
  try {
    const {
      siteId,
      siteName,
      siteImage,
      visitDate,
      timeSlot,
      seats,
      visitorName,
      visitorEmail,
      visitorPhone,
      specialRequest,
    } = req.body;

    if (
      !siteId ||
      !siteName ||
      !visitDate ||
      !timeSlot ||
      !seats ||
      !visitorName ||
      !visitorEmail
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required reservation details.",
      });
    }

    const selectedDate = new Date(visitDate);

    if (Number.isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid visit date.",
      });
    }

    const seatCount = Number(seats);

    if (seatCount < 1 || seatCount > 10) {
      return res.status(400).json({
        success: false,
        message: "You can reserve between 1 and 10 seats.",
      });
    }

    const reservation = await Reservation.create({
      reservationCode: generateReservationCode(),
      user: req.user._id,

      siteId,
      siteName,
      siteImage: siteImage || "",

      visitDate: selectedDate,
      timeSlot,

      seats: seatCount,

      visitorName,
      visitorEmail,
      visitorPhone: visitorPhone || "",
      specialRequest: specialRequest || "",
    });

    res.status(201).json({
      success: true,
      message: "Your heritage visit has been reserved successfully.",
      reservation,
    });
  } catch (error) {
    console.error("Create reservation error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create reservation.",
    });
  }
};

export const getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      reservations,
    });
  } catch (error) {
    console.error("Get reservations error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch reservations.",
    });
  }
};

export const cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found.",
      });
    }

    if (reservation.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "This reservation is already cancelled.",
      });
    }

    reservation.status = "cancelled";

    await reservation.save();

    res.status(200).json({
      success: true,
      message: "Reservation cancelled successfully.",
      reservation,
    });
  } catch (error) {
    console.error("Cancel reservation error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to cancel reservation.",
    });
  }
};