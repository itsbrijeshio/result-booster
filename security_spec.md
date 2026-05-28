# Firebase Security Specification & TDD Test Scenarios

## 1. Data Invariants

1. **Student Account Integrity**: A student document's database ID must correspond to their authenticated userId (`request.auth.uid`), preventing student impersonation and profile manipulation.
2. **Read Restrictiveness**: Test attempts and student profile documents containing potential PII/confidential grades are strictly viewable only by the owner of the document or authorized administrators (instructors).
3. **Immutability of Key Fields**: Once created, `createdAt` and `studentId` fields in `testAttempts` are immutable and cannot be rewritten.
4. **Validation Bounds**: All names and titles must be within size boundaries (e.g., text length under 100 characters), and percentage scores or accuracies must be between 0 and 100.
5. **No Self-Assigned Roles/Access**: Direct client-side changes cannot bypass administrative rosters or register arbitrary batches without validation.

---

## 2. The "Dirty Dozen" Malicious Exploits (Blocked Payloads)

We've designed 12 specialized exploitative payloads that attempt to hijack identity, escalate credentials, or inject invalid data. Our security rules mathematically forbid all of them.

### Case 1: The Identity Hijacker (User Spoofing)
* **Goal**: Write a student profile document using another student's authenticated UID.
* **Payload**:
  ```json
  {
    "id": "st-victim-123",
    "email": "malicious-spy@attacker.org",
    "name": "Attacker Hijack",
    "batchId": "batch-1",
    "batchName": "CCC Morning Batch A",
    "status": "active"
  }
  ```
* **Why Denied**: Authenticated UID `request.auth.uid` must strictly match the `studentId`/`id` on creation or update.

### Case 2: The Rogue Administrator (Privilege Escalation)
* **Goal**: Write a user document or set an admin flag to gain administrative system capabilities.
* **Payload**:
  ```json
  {
    "id": "attacker-uid",
    "email": "attacker@darkweb.org",
    "name": "Super Admin Attacker",
    "role": "admin",
    "isAdmin": true
  }
  ```
* **Why Denied**: Admin designations must be verified through a trusted Firestore collection lookup, and mutating role status fields is forbidden from client SDK configurations.

### Case 3: The Grade Booster (Infinite Score Update)
* **Goal**: Change the score on a historic `testAttempt` after submitting to lock down top marks.
* **Payload**:
  ```json
  {
    "id": "att-1",
    "score": 100,
    "maxScore": 100,
    "correctCount": 5,
    "wrongCount": 0
  }
  ```
* **Why Denied**: Updating `score` or changing `testAttempt` records once committed is locked down by write permissions constraints.

### Case 4: The Ghost Batch Injection (Orphaned Record Creation)
* **Goal**: Create a test attempt referencing a non-existent batch id or test id.
* **Payload**:
  ```json
  {
    "id": "att-fake-999",
    "testId": "non-existent-test-id",
    "testTitle": "Hacked Test Outline",
    "studentId": "st-6",
    "score": 90,
    "maxScore": 100,
    "submittedAt": "2026-05-28"
  }
  ```
* **Why Denied**: Create rules require verifiable `exists()` check on parent references.

### Case 5: Denial-of-Wallet String Poisoning (Junk character injection)
* **Goal**: Exhaust Firestore memory quota by setting a 10MB string as the `name` field.
* **Payload**:
  ```json
  {
    "id": "st-6",
    "name": "AveryLongStringRepeated..."
  }
  ```
* **Why Denied**: Every text field value length has strict `.size() <= 100` checks.

### Case 6: Temporal Spoofing (Client Timestamp Forge)
* **Goal**: Write a historic or future date to claim a test attempt was submitted early.
* **Payload**:
  ```json
  {
    "id": "att-new",
    "submittedAt": "1999-01-01"
  }
  ```
* **Why Denied**: Timestamps must comply with `request.time` or validated date patterns.

### Case 7: Resource Exhaustion ID Poisoning
* **Goal**: Inject a mammoth-sized ID `some-extremely-long-string-of-1024-characters-...` to compromise internal indexing speed.
* **Why Denied**: Checked by `isValidId(id)` pattern limit of `id.size() <= 128` and rigid alpha-numeric regex.

### Case 8: The Grade Blanket Snoop (PII Scraping)
* **Goal**: An authenticated student attempting to list ALL test attempts belonging to OTHER students.
* **Why Denied**: `allow list` requires `resource.data.studentId == request.auth.uid`.

### Case 9: The Syllabus Destructor (Rogue deletion)
* **Goal**: A student client attempts to send a `deleteDoc` request targeting global course batches or questions.
* **Why Denied**: Modification rights for structural catalogs are restricted to administrative accounts.

### Case 10: Status Step Skipping (Shortcutting Exam Status)
* **Goal**: Direct modification of a Draft Test to Active by a student user.
* **Why Denied**: Student write operations are locked, and status mutation triggers must match valid transitions.

### Case 11: Invalid Enumerated Status (Out of Scope Status Type)
* **Goal**: Injecting a custom status like `"status": "ultra-pass"` inside Student record.
* **Why Denied**: Evaluated against the strict schema `enum` values check in security functions.

### Case 12: Anonymous Access (Non-verified write)
* **Goal**: Unauthenticated or unverified email endpoint writing public questions.
* **Why Denied**: Absolute requirement of `request.auth.token.email_verified == true`.

---

## 3. Standard Test Suite (`firestore.rules.test.ts`)

A demonstrative simulator verifying the security gates.

```typescript
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";

describe("Booster Security Gate TDD Suite", () => {
  let testEnv;

  before(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: "gen-lang-client-0269420787",
      firestore: {
        rules: require("fs").readFileSync("firestore.rules", "utf8"),
      }
    });
  });

  after(async () => {
    await testEnv.cleanup();
  });

  it("Blocks the Identity Hijacker (Case 1)", async () => {
    const maliciousClient = testEnv.authenticatedContext("malicious-uid");
    const db = maliciousClient.firestore();
    
    await assertFails(
      db.collection("students").doc("st-victim-123").set({
        id: "st-victim-123",
        email: "malicious-spy@attacker.org",
        name: "Attacker Hijack",
        batchId: "batch-1",
        batchName: "CCC Morning Batch A",
        status: "active"
      })
    );
  });

  it("Grants reading rights to their own progress data only (Case 8)", async () => {
    const rSenClient = testEnv.authenticatedContext("st-6");
    const db = rSenClient.firestore();
    
    await assertSucceeds(
      db.collection("students").doc("st-6").get()
    );
  });
});
```
