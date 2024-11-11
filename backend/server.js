const express = require("express");
const oracledb = require("oracledb");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 5001;

app.use(cors());
app.use(bodyParser.json());

// Database connection function
async function getDbConnection() {
  try {
    return await oracledb.getConnection({
      user: "system",
      password: "Cookie12", // Replace with your actual password
      connectString: "localhost:1521/FREEPDB1",
    });
  } catch (err) {
    console.error("Database connection error:", err);
    return null;
  }
}

// GET and POST endpoints for each table

// 1. Animal
app.get("/api/animals", async (req, res) => {
  const connection = await getDbConnection();
  if (!connection) return res.status(500).send("Database connection error");

  try {
    const result = await connection.execute("SELECT * FROM Animal");
    res.json(
      result.rows.map((row) => ({
        animalid: row[0],
        name: row[1],
        species: row[2],
        breed: row[3],
        dateOfBirth: row[4],
        gender: row[5],
        healthStatus: row[6],
      }))
    );
  } finally {
    await connection.close();
  }
});

app.post("/api/animals", async (req, res) => {
  const { animalid, name, species, breed, dateOfBirth, gender, healthStatus } =
    req.body;
  const connection = await getDbConnection();
  if (!connection) return res.status(500).send("Database connection error");

  try {
    await connection.execute(
      `INSERT INTO Animal (AnimalID, Name, Species, Breed, DateOfBirth, Gender, HealthStatus)
       VALUES (:animalid, :name, :species, :breed, TO_DATE(:dateOfBirth, 'YYYY-MM-DD'), :gender, :healthStatus)`,
      { animalid, name, species, breed, dateOfBirth, gender, healthStatus },
      { autoCommit: true }
    );
    res.status(201).send("Animal record inserted successfully");
  } finally {
    await connection.close();
  }
});

// 2. HealthRecord
app.get("/api/health-records", async (req, res) => {
  const connection = await getDbConnection();
  if (!connection) return res.status(500).send("Database connection error");

  try {
    const result = await connection.execute("SELECT * FROM HealthRecord");
    res.json(
      result.rows.map((row) => ({
        healthRecordId: row[0],
        animalId: row[1],
        date: row[2],
        description: row[3],
        treatment: row[4],
        veterinarianId: row[5],
        nextCheckupDate: row[6],
      }))
    );
  } finally {
    await connection.close();
  }
});

app.post("/api/health-records", async (req, res) => {
  const {
    healthRecordId,
    animalId,
    date,
    description,
    treatment,
    veterinarianId,
    nextCheckupDate,
  } = req.body;
  const connection = await getDbConnection();
  if (!connection) return res.status(500).send("Database connection error");

  try {
    await connection.execute(
      `INSERT INTO HealthRecord (HealthRecordID, AnimalID, Date, Description, Treatment, VeterinarianID, NextCheckupDate)
       VALUES (:healthRecordId, :animalId, TO_DATE(:date, 'YYYY-MM-DD'), :description, :treatment, :veterinarianId, TO_DATE(:nextCheckupDate, 'YYYY-MM-DD'))`,
      {
        healthRecordId,
        animalId,
        date,
        description,
        treatment,
        veterinarianId,
        nextCheckupDate,
      },
      { autoCommit: true }
    );
    res.status(201).send("Health record inserted successfully");
  } finally {
    await connection.close();
  }
});

// 3. BreedingRecord
app.get("/api/breeding-records", async (req, res) => {
  const connection = await getDbConnection();
  if (!connection) return res.status(500).send("Database connection error");

  try {
    const result = await connection.execute("SELECT * FROM BreedingRecord");
    res.json(
      result.rows.map((row) => ({
        breedingRecordId: row[0],
        animalId: row[1],
        partnerAnimalId: row[2],
        breedingDate: row[3],
        result: row[4],
        notes: row[5],
      }))
    );
  } finally {
    await connection.close();
  }
});

app.post("/api/breeding-records", async (req, res) => {
  const {
    breedingRecordId,
    animalId,
    partnerAnimalId,
    breedingDate,
    result,
    notes,
  } = req.body;
  const connection = await getDbConnection();
  if (!connection) return res.status(500).send("Database connection error");

  try {
    await connection.execute(
      `INSERT INTO BreedingRecord (BreedingRecordID, AnimalID, PartnerAnimalID, BreedingDate, Result, Notes)
       VALUES (:breedingRecordId, :animalId, :partnerAnimalId, TO_DATE(:breedingDate, 'YYYY-MM-DD'), :result, :notes)`,
      {
        breedingRecordId,
        animalId,
        partnerAnimalId,
        breedingDate,
        result,
        notes,
      },
      { autoCommit: true }
    );
    res.status(201).send("Breeding record inserted successfully");
  } finally {
    await connection.close();
  }
});

// 4. FeedingSchedule
app.get("/api/feeding-schedules", async (req, res) => {
  const connection = await getDbConnection();
  if (!connection) return res.status(500).send("Database connection error");

  try {
    const result = await connection.execute("SELECT * FROM FeedingSchedule");
    res.json(
      result.rows.map((row) => ({
        feedingScheduleId: row[0],
        animalId: row[1],
        feedingDate: row[2],
        feedType: row[3],
        quantity: row[4],
        notes: row[5],
      }))
    );
  } finally {
    await connection.close();
  }
});

app.post("/api/feeding-schedules", async (req, res) => {
  const {
    feedingScheduleId,
    animalId,
    feedingDate,
    feedType,
    quantity,
    notes,
  } = req.body;
  const connection = await getDbConnection();
  if (!connection) return res.status(500).send("Database connection error");

  try {
    await connection.execute(
      `INSERT INTO FeedingSchedule (FeedingScheduleID, AnimalID, FeedingDate, FeedType, Quantity, Notes)
       VALUES (:feedingScheduleId, :animalId, TO_DATE(:feedingDate, 'YYYY-MM-DD'), :feedType, :quantity, :notes)`,
      { feedingScheduleId, animalId, feedingDate, feedType, quantity, notes },
      { autoCommit: true }
    );
    res.status(201).send("Feeding schedule inserted successfully");
  } finally {
    await connection.close();
  }
});

// 5. ProductionPerformance
app.get("/api/production-performances", async (req, res) => {
  const connection = await getDbConnection();
  if (!connection) return res.status(500).send("Database connection error");

  try {
    const result = await connection.execute(
      "SELECT * FROM ProductionPerformance"
    );
    res.json(
      result.rows.map((row) => ({
        performanceId: row[0],
        animalId: row[1],
        date: row[2],
        productionYield: row[3],
        weightGain: row[4],
        otherMetrics: row[5],
      }))
    );
  } finally {
    await connection.close();
  }
});

app.post("/api/production-performances", async (req, res) => {
  const {
    performanceId,
    animalId,
    date,
    productionYield,
    weightGain,
    otherMetrics,
  } = req.body;
  const connection = await getDbConnection();
  if (!connection) return res.status(500).send("Database connection error");

  try {
    await connection.execute(
      `INSERT INTO ProductionPerformance (PerformanceID, AnimalID, Date, ProductionYield, WeightGain, OtherMetrics)
       VALUES (:performanceId, :animalId, TO_DATE(:date, 'YYYY-MM-DD'), :productionYield, :weightGain, :otherMetrics)`,
      {
        performanceId,
        animalId,
        date,
        productionYield,
        weightGain,
        otherMetrics,
      },
      { autoCommit: true }
    );
    res.status(201).send("Production performance record inserted successfully");
  } finally {
    await connection.close();
  }
});

// 6. Veterinarian
app.get("/api/veterinarians", async (req, res) => {
  const connection = await getDbConnection();
  if (!connection) return res.status(500).send("Database connection error");

  try {
    const result = await connection.execute("SELECT * FROM Veterinarian");
    res.json(
      result.rows.map((row) => ({
        veterinarianId: row[0],
        name: row[1],
        contactInfo: row[2],
        specialization: row[3],
      }))
    );
  } finally {
    await connection.close();
  }
});

app.post("/api/veterinarians", async (req, res) => {
  const { veterinarianId, name, contactInfo, specialization } = req.body;
  const connection = await getDbConnection();
  if (!connection) return res.status(500).send("Database connection error");

  try {
    await connection.execute(
      `INSERT INTO Veterinarian (VeterinarianID, Name, ContactInfo, Specialization)
       VALUES (:veterinarianId, :name, :contactInfo, :specialization)`,
      { veterinarianId, name, contactInfo, specialization },
      { autoCommit: true }
    );
    res.status(201).send("Veterinarian record inserted successfully");
  } finally {
    await connection.close();
  }
});

// 1. Animal
app.delete("/api/animals/:animalid", async (req, res) => {
  const { animalid } = req.params;
  const connection = await getDbConnection();
  if (!connection) return res.status(500).send("Database connection error");

  try {
    const result = await connection.execute(
      "DELETE FROM Animal WHERE AnimalID = :animalid",
      { animalid },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).send("Animal record not found");
    }
    res.send("Animal record deleted successfully");
  } finally {
    await connection.close();
  }
});

// 2. HealthRecord
app.delete("/api/health-records/:healthRecordId", async (req, res) => {
  const { healthRecordId } = req.params;
  const connection = await getDbConnection();
  if (!connection) return res.status(500).send("Database connection error");

  try {
    const result = await connection.execute(
      "DELETE FROM HealthRecord WHERE HealthRecordID = :healthRecordId",
      { healthRecordId },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).send("Health record not found");
    }
    res.send("Health record deleted successfully");
  } finally {
    await connection.close();
  }
});

// 3. BreedingRecord
app.delete("/api/breeding-records/:breedingRecordId", async (req, res) => {
  const { breedingRecordId } = req.params;
  const connection = await getDbConnection();
  if (!connection) return res.status(500).send("Database connection error");

  try {
    const result = await connection.execute(
      "DELETE FROM BreedingRecord WHERE BreedingRecordID = :breedingRecordId",
      { breedingRecordId },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).send("Breeding record not found");
    }
    res.send("Breeding record deleted successfully");
  } finally {
    await connection.close();
  }
});

// 4. FeedingSchedule
app.delete("/api/feeding-schedules/:feedingScheduleId", async (req, res) => {
  const { feedingScheduleId } = req.params;
  const connection = await getDbConnection();
  if (!connection) return res.status(500).send("Database connection error");

  try {
    const result = await connection.execute(
      "DELETE FROM FeedingSchedule WHERE FeedingScheduleID = :feedingScheduleId",
      { feedingScheduleId },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).send("Feeding schedule not found");
    }
    res.send("Feeding schedule deleted successfully");
  } finally {
    await connection.close();
  }
});

// 5. ProductionPerformance
app.delete("/api/production-performances/:performanceId", async (req, res) => {
  const { performanceId } = req.params;
  const connection = await getDbConnection();
  if (!connection) return res.status(500).send("Database connection error");

  try {
    const result = await connection.execute(
      "DELETE FROM ProductionPerformance WHERE PerformanceID = :performanceId",
      { performanceId },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).send("Production performance record not found");
    }
    res.send("Production performance record deleted successfully");
  } finally {
    await connection.close();
  }
});

// 6. Veterinarian
app.delete("/api/veterinarians/:veterinarianId", async (req, res) => {
  const { veterinarianId } = req.params;
  const connection = await getDbConnection();
  if (!connection) return res.status(500).send("Database connection error");

  try {
    const result = await connection.execute(
      "DELETE FROM Veterinarian WHERE VeterinarianID = :veterinarianId",
      { veterinarianId },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).send("Veterinarian record not found");
    }
    res.send("Veterinarian record deleted successfully");
  } finally {
    await connection.close();
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
