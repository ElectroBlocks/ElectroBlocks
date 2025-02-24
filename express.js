process.env.NODE_NO_WARNINGS = "1";
import express from "express";
import { SerialPort } from "serialport";

const app = express();
const PORT = 3000;

// Route to list available serial ports with details
app.get("/ports", async (req, res) => {
  try {
    const ports = await SerialPort.list();
    if (ports.length === 0) {
      res.json({ message: "No serial devices connected." });
    } else {
      res.json(ports.map(port => ({
        path: port.path,
        manufacturer: port.manufacturer || "Unknown",
        vendorId: port.vendorId || "N/A",
        productId: port.productId || "N/A",
        serialNumber: port.serialNumber || "N/A"
      })));
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Express server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/ports`);
});