import express from "express";
import { getDB } from "../utils/db.js"; // Import the database getter function
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ObjectId } from 'mongodb'; // Import ObjectId at the top

const router = express.Router();





// Get employee details by ID
router.get("/detail/:id", async (req, res) => {
  const id = req.params.id;
  
  try {
    const db = getDB(); // Get database instance
    
    const employee = await db.collection("employees").findOne({ 
      _id: new ObjectId(id) 
    });
    
    if (employee) {
      res.json({ success: true, Result: [employee] }); // Keeping array format for compatibility
    } else {
      res.json({ success: false, message: "Employee not found" });
    }
  } catch (error) {
    console.error("Error fetching employee:", error);
    res.json({ success: false, message: "Failed to fetch employee" });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  return res.json({ Status: true });
});

// Route to check if employee is currently clocked in
router.get("/employee_is_clocked_in/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const db = getDB(); // Get database instance
    
    // Check if there is a clock-in record without a corresponding clock-out time
    const clockRecord = await db.collection("clock_records").findOne({
      employee_id: new ObjectId(id),
      clock_out: null
    });

    // Send success response with clock-in status
    return res.status(200).json({ clockedIn: clockRecord !== null });
  } catch (error) {
    console.error("Error while checking clock-in status:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

// Route to handle employee clock-in
router.post("/employee_clockin/:id", async (req, res) => {
  const { id } = req.params;
  const { location, work_from_type } = req.body;

  try {
    const db = getDB(); // Get database instance
    
    // Insert clock-in record into the database
    const clockRecord = {
      employee_id: new ObjectId(id),
      clock_in: new Date(),
      location: location,
      work_from_type: work_from_type,
      clock_out: null
    };

    await db.collection("clock_records").insertOne(clockRecord);

    // Send success response
    return res.status(200).json({ status: "success" });
  } catch (error) {
    console.error("Error while clocking in:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error" });
  }
});

// Route to handle employee clock-out
router.post("/employee_clockout/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const db = getDB(); // Get database instance
    
    // Update the clock-out time for the employee
    await db.collection("clock_records").updateOne(
      {
        employee_id: new ObjectId(id),
        clock_out: null,
      },
      {
        $set: { clock_out: new Date() },
      }
    );
    // Send success response
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error while clocking out:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

// Route to fetch calendar data for a specific employee
router.get("/calendar/:employeeId", async (req, res) => {
  const { employeeId } = req.params;

  try {
    const db = getDB(); // Get database instance
    
    // Fetch clock records for the employee from the database
    const clockRecords = await db.collection("clock_records")
      .find({ employee_id: new ObjectId(employeeId) })
      .toArray();

    // Process the result and format the data as needed
    const calendarData = clockRecords.map((record) => {
      // Extract date from timestamp and format it as 'YYYY-MM-DD'
      const date = record.clock_in.toISOString().slice(0, 10);
      // Get day name from the date
      const dayName = new Date(record.clock_in).toLocaleDateString("en-US", {
        weekday: "long",
      });

      return {
        date: date,
        dayName: dayName,
        clockIn: record.clock_in,
        clockOut: record.clock_out,
        location: record.location,
        workFromType: record.work_from_type,
      };
    });

    // Send success response with formatted calendar data
    res.status(200).json({ success: true, calendarData });
  } catch (error) {
    console.error("Error fetching calendar data:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Define a route to get category by ID
router.get("/category/:id", async (req, res) => {
  const categoryId = req.params.id;

  try {
    const db = getDB(); // Get database instance
    
    const category = await db.collection("categories").findOne({ 
      _id: new ObjectId(categoryId) 
    });

    if (!category) {
      return res
        .status(404)
        .json({ success: false, error: "Category not found" });
    }
    res.status(200).json({ success: true, category: category });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Route to get office location data
router.get("/office_location", async (req, res) => {
  try {
    const db = getDB(); // Get database instance
    
    const officeLocations = await db.collection("office_locations").find({}).toArray();
    res.status(200).json({ success: true, officeLocations: officeLocations });
  } catch (error) {
    console.error("Error fetching office locations:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Route to add a new office location
router.post("/office_location", async (req, res) => {
  const { name, latitude, longitude, address } = req.body;

  try {
    const db = getDB(); // Get database instance
    
    const newLocation = {
      name: name,
      latitude: latitude,
      longitude: longitude,
      address: address,
      createdAt: new Date()
    };

    const result = await db.collection("office_locations").insertOne(newLocation);
    
    // Return the inserted document with its new _id
    const insertedLocation = { ...newLocation, _id: result.insertedId };

    res.status(201).json({ success: true, officeLocation: insertedLocation });
  } catch (error) {
    console.error("Error adding office location:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Route to delete an office location by ID
router.delete("/office_location/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const db = getDB(); // Get database instance
    
    await db.collection("office_locations").deleteOne({ 
      _id: new ObjectId(id) 
    });
    res
      .status(200)
      .json({ success: true, message: "Office location deleted successfully" });
  } catch (error) {
    console.error("Error deleting office location:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Route to fetch all employees
router.get("/employee/list", async (req, res) => {
  try {
    const db = getDB(); // Get database instance
    
    // Fetch all employees from the database
    const employees = await db.collection("employees")
      .find({}, { projection: { _id: 1, name: 1, role: 1 } })
      .toArray();

    // Convert _id to id for compatibility
    const formattedEmployees = employees.map(emp => ({
      id: emp._id,
      name: emp.name,
      role: emp.role
    }));

    // Send the response with the list of employees
    res.status(200).json({ success: true, employees: formattedEmployees });
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

export { router as employeeRouter };