// import Reservation from "../models/Reservation.js";

// const generateReservationCode = () => {
//   const random = Math.random()
//     .toString(36)
//     .substring(2, 7)
//     .toUpperCase();

//   return `BD-${Date.now()
//     .toString()
//     .slice(-6)}-${random}`;
// };

// export const createReservation = async (req, res) => {
//   try {
//     const {
//       siteId,
//       siteName,
//       siteImage,
//       visitDate,
//       timeSlot,
//       seats,
//       visitorName,
//       visitorEmail,
//       visitorPhone,
//       specialRequest,
//     } = req.body;

//     if (
//       !siteId ||
//       !siteName ||
//       !visitDate ||
//       !timeSlot ||
//       !seats ||
//       !visitorName ||
//       !visitorEmail
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Please fill all required reservation details.",
//       });

      
//     }

//     const selectedDate = new Date(visitDate);

//     if (Number.isNaN(selectedDate.getTime())) {
//       return res.status(400).json({
//         success: false,
//         message: "Please select a valid visit date.",
//       });
//     }

//     const seatCount = Number(seats);

//     if (seatCount < 1 || seatCount > 10) {
//       return res.status(400).json({
//         success: false,
//         message: "You can reserve between 1 and 10 seats.",
//       });
//     }

//     const reservation = await Reservation.create({
//       reservationCode: generateReservationCode(),
//       user: req.user._id,

//       siteId,
//       siteName,
//       siteImage: siteImage || "",

//       visitDate: selectedDate,
//       timeSlot,

//       seats: seatCount,

//       visitorName,
//       visitorEmail,
//       visitorPhone: visitorPhone || "",
//       specialRequest: specialRequest || "",
//     });

//     res.status(201).json({
//       success: true,
//       message: "Your heritage visit has been reserved successfully.",
//       reservation,
//     });
//   } catch (error) {
//     console.error("Create reservation error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Unable to create reservation.",
//     });
//   }
// };

// export const getMyReservations = async (req, res) => {
//   try {
//     const reservations = await Reservation.find({
//       user: req.user._id,
//     }).sort({
//       createdAt: -1,
//     });

//     res.status(200).json({
//       success: true,
//       reservations,
//     });
//   } catch (error) {
//     console.error("Get reservations error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Unable to fetch reservations.",
//     });
//   }
// };

// export const cancelReservation = async (req, res) => {
//   try {
//     const reservation = await Reservation.findOne({
//       _id: req.params.id,
//       user: req.user._id,
//     });

//     if (!reservation) {
//       return res.status(404).json({
//         success: false,
//         message: "Reservation not found.",
//       });
//     }

//     if (reservation.status === "cancelled") {
//       return res.status(400).json({
//         success: false,
//         message: "This reservation is already cancelled.",
//       });
//     }

//     reservation.status = "cancelled";

//     await reservation.save();

//     res.status(200).json({
//       success: true,
//       message: "Reservation cancelled successfully.",
//       reservation,
//     });
//   } catch (error) {
//     console.error("Cancel reservation error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Unable to cancel reservation.",
//     });
//   }
// };

import Reservation from "../models/Reservation.js";
import ExcelJS from "exceljs";
import { sendBookingConfirmationEmail, sendCancellationEmail } from "../utils/emailService.js";

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

    // ── Send confirmation email (reservation fail na ho isliye alag try-catch) ──
    try {
      await sendBookingConfirmationEmail(
        reservation.visitorEmail,
        reservation.visitorName,
        {
          reservationCode: reservation.reservationCode,
          siteName: reservation.siteName,
          visitDate: reservation.visitDate,
          timeSlot: reservation.timeSlot,
          seats: reservation.seats,
        }
      );
    } catch (emailErr) {
      console.error(
        "⚠️ Reservation created but confirmation email failed:",
        emailErr.message
      );
      // reservation ban chuki hai, sirf email fail hui — booking fail nahi karani
    }

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

// ════════════════════════════════════════════════
// EXPORT ALL RESERVATIONS TO EXCEL (Admin only)
// ════════════════════════════════════════════════
export const exportReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Reservations");

    sheet.columns = [
      { header: "Reservation Code", key: "reservationCode", width: 22 },
      { header: "Site Name", key: "siteName", width: 25 },
      { header: "Visit Date", key: "visitDate", width: 15 },
      { header: "Time Slot", key: "timeSlot", width: 20 },
      { header: "Seats", key: "seats", width: 10 },
      { header: "Visitor Name", key: "visitorName", width: 20 },
      { header: "Visitor Email", key: "visitorEmail", width: 28 },
      { header: "Visitor Phone", key: "visitorPhone", width: 16 },
      { header: "Status", key: "status", width: 12 },
      { header: "Special Request", key: "specialRequest", width: 25 },
      { header: "Booked On", key: "createdAt", width: 20 },
    ];

    // ── Header row styling ──
    sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
    sheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF0D1B2A" },
    };

    reservations.forEach((r) => {
      sheet.addRow({
        reservationCode: r.reservationCode,
        siteName: r.siteName,
        visitDate: new Date(r.visitDate).toLocaleDateString("en-IN"),
        timeSlot: r.timeSlot,
        seats: r.seats,
        visitorName: r.visitorName,
        visitorEmail: r.visitorEmail,
        visitorPhone: r.visitorPhone || "-",
        status: r.status,
        specialRequest: r.specialRequest || "-",
        createdAt: new Date(r.createdAt).toLocaleString("en-IN"),
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=reservations-${Date.now()}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error("Export reservations error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to export reservations.",
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

    // ── Send cancellation email (fail ho jaye toh bhi cancel successful rahe) ──
    try {
      await sendCancellationEmail(
        reservation.visitorEmail,
        reservation.visitorName,
        {
          reservationCode: reservation.reservationCode,
          siteName: reservation.siteName,
          visitDate: reservation.visitDate,
          timeSlot: reservation.timeSlot,
          seats: reservation.seats,
        }
      );
    } catch (emailErr) {
      console.error(
        "⚠️ Reservation cancelled but cancellation email failed:",
        emailErr.message
      );
  
    }

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