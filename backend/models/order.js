import mongoose from "mongoose";


const OrderSchema = new mongoose.Schema(
 

  {
     
    // 🧪 TEST MODE FLAG
    isTest: {
      type: Boolean,
      default: false,
      index: true, // helpful for filtering test orders
    },

   membershipId: {
  type: String,
  required: true,
  index: true,   // ✅ fast search, NOT unique
},


// // ✅ ADD THIS
// parentMembershipId: {
//   type: String,
//   required: true,
//   index: true, // 🔥 important for fast grouping
// },

    receiptNumber: {
      type: String,
      unique: true,
      required: true,
    },

    invoiceUrl: String,

    user: {
      firstName: String,
      lastName: String,
      phone: String,
      email: String,
       emailChanges:    { type: Number, default: 0 },  // ← add this
  lastEmailChange: { type: Date },                 // ← add this
  phoneChanges:    { type: Number, default: 0 },  // ← add this
  lastPhoneChange: { type: Date }, 
      dob: {
        type: Date, // ✅ BEST PRACTICE
      },
    },


   address: {
  pincode:  String,
  house:    String,
  street:   String,
  landmark: String,
  city:     { type: String, default: "Dombivli" },
  state:    { type: String, default: "Maharashtra" },
  addressChanges:    { type: Number, default: 0 },  // ← add
  lastAddressChange: { type: Date },                 // ← add
},

   healthInfo: {
  allergies: String,
  medicalConditions: String,
},

remarks: String,


    // ✅ DELIVERY SLOT (FIXED)
    deliverySlot: {
      type: String,
      required: true,
    },

    subscription: {
plan: {
  type: String,
  enum: [
   
    "SILVER_1MONTH",
    "GOLD_1MONTH",
    "PLATINUM_1MONTH",
    "SILVER_3MONTH",
    "GOLD_3MONTH",
    "PLATINUM_3MONTH",
  ],
},
      amount: {
        type: Number,
        required: true,
      },
      originalAmount: {
  type: Number,
},
      durationMonths: {
        type: Number,
        default: 1, // ✅ 1 month
      },

      // ⏳ ACTIVATION AFTER 48 HOURS
   activationAt: {
  type: Date,
  required: true,
  default: Date.now,
},



      // 📆 Subscription starts ONLY after activation
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
      pause: {
        used: { type: Number, default: 0 }, // ✅ pause counter
        history: [
          {
            startDate: Date,
            endDate: Date,   
            resumeDate: Date,
            days: Number,
          },
        ],
      },

      renewalHistory: [
  {
    date: Date,
    durationMonths: Number,
    amount: Number,
    paymentMethod: String,
    startDate: Date,
    activationAt: Date,
    endDate: Date,
  },
],

 renewedAt: {
        type: Date,
      },
      renewalTriggeredBy: {
        type: String,
      },

      periodHistory: [
        {
          plan: String,
          amount: Number,
          startDate: Date,
          endDate: Date,
          activationAt: Date,
          status: String,
          snapshotAt: { type: Date, default: Date.now },
        },
      ],

      status: {
        type: String,
        enum: ["UNDER_PROCESS", "ACTIVE", "PAUSED", "CANCELLED", "EXPIRED", "UPCOMING"],
        default: "UNDER_PROCESS", // 🟠 default now
      },
       // 🔔 NEW FIELDS (ADD THESE)
   // 🔔 MULTI-REMINDER SUPPORT
      renewalReminderStage: {
        type: String,
        enum: ["NONE", "4D", "1D"],
        default: "NONE",
      },

      renewalReminderDate: {
        type: Date,
      },
    
      thankYouEmailSentAt: Date,
welcomeEmailSent: {
  type: Boolean,
  default: false,
},
renewal: {
  pending: {
    type: Boolean,
    default: false,
  },
  durationMonths: Number,
},

// 🆕 QUEUED-PLAN LINKAGE — set on an UPCOMING order so we always know
// exactly which order it supersedes, and set on the CURRENT order so
// dashboards/support tooling can see a queued plan is waiting.
queuedFromOrderId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Order",
},
supersededByOrderId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Order",
},

noDeliveryHistory: [
  {
    date: { type: Date, required: true },
    reason: { type: String, required: true },
    daysAdded: { type: Number, default: 1 },
    appliedBy: { type: String },
    appliedAt: { type: Date, default: Date.now },
  }
],

},




    

   paymentStatus: {
  type: String,
  enum: ["PENDING", "PAID", "FAILED"],
  default: "PENDING",
},

   paymentMethod: {
  type: String,
  enum: ["CASH", "ONLINE", "GPAY", "CARD", "EASEBUZZ", "UPI", "CHEQUE" , "BANK_TRANSFER"],
  default: "CASH",
},

transactionId: {
  type: String,
  default: "",
},

  },
  { timestamps: true },
);
if (mongoose.models.Order) {
  delete mongoose.models.Order;
}

export default mongoose.model("Order", OrderSchema);