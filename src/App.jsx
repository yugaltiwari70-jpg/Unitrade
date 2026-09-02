import { useState, useEffect } from "react";
import "./App.css";
const initialProducts = [
  {
    id: 1,
    icon: "📘",
    category: "Books",
    title: "C Programming Book",
    description: "Complete C programming book for engineering students.",
    condition: "Good",
    price: "₹250",
    seller: "Rahul",
    location: "Campus Library",
    phone: "9876543210",
    email: "rahul@college.edu",
  },
  {
    id: 2,
    icon: "📐",
    category: "Graphics",
    title: "Engineering Graphics Kit",
    description: "Complete graphics kit with instruments for engineering drawing.",
    condition: "Like New",
    price: "₹350",
    seller: "Aman",
    location: "Block A",
    phone: "9876543211",
    email: "aman@college.edu",
  },
  {
    id: 3,
    icon: "🧪",
    category: "Lab Equipment",
    title: "Chemistry Lab Coat",
    description: "Clean lab coat suitable for college practical sessions.",
    condition: "Good",
    price: "₹180",
    seller: "Priya",
    location: "Science Block",
    phone: "9876543212",
    email: "priya@college.edu",
  },
  {
    id: 4,
    icon: "📝",
    category: "Notes",
    title: "Engineering Maths Notes",
    description: "Student-made notes covering important engineering mathematics topics.",
    condition: "Excellent",
    price: "Free",
    seller: "Yugal",
    location: "Hostel",
    phone: "9876543213",
    email: "yugal@college.edu",
  },
];

const resources = [
  { icon: "📄", title: "Previous Year Papers", count: "120+ papers" },
  { icon: "📝", title: "Handwritten Notes", count: "85+ resources" },
  { icon: "🧪", title: "Lab Manuals", count: "40+ manuals" },
];

const defaultTeammates = [
  {
    id: 1,
    name: "Aarav Sharma",
    role: "Coder",
    skills: ["C++", "Python", "DSA"],
    experience: "3 Hackathons",
    rating: null,
    reviews: 0,
    status: "Available",
    college: "Amity University",
    about: "Strong in problem solving and backend logic.",
    phone: "9876500001",
    email: "aarav@college.edu",
    image: "",
  },
  {
    id: 2,
    name: "Priya Verma",
    role: "Presenter",
    skills: ["PPT", "Public Speaking", "Pitching"],
    experience: "5 Presentations",
    rating: null,
    reviews: 0,
    status: "Available",
    college: "Amity University",
    about: "Confident presenter for demos and final pitches.",
    phone: "9876500002",
    email: "priya@college.edu",
    image: "",
  },
  {
    id: 3,
    name: "Rohan Gupta",
    role: "Frontend Developer",
    skills: ["React", "JavaScript", "CSS"],
    experience: "2 Projects",
    rating: null,
    reviews: 0,
    status: "Available",
    college: "Amity University",
    about: "Builds responsive and interactive interfaces.",
    phone: "9876500003",
    email: "rohan@college.edu",
    image: "",
  },
  {
    id: 4,
    name: "Neha Singh",
    role: "UI/UX Designer",
    skills: ["Figma", "UI Design", "Prototyping"],
    experience: "4 Projects",
    rating: null,
    reviews: 0,
    status: "Busy",
    college: "Amity University",
    about: "Designs clean and user-friendly hackathon products.",
    phone: "9876500004",
    email: "neha@college.edu",
    image: "",
  },
  {
    id: 5,
    name: "Vivek Patel",
    role: "Data Analyst",
    skills: ["Python", "Pandas", "SQL"],
    experience: "2 Hackathons",
    rating: null,
    reviews: 0,
    status: "Available",
    college: "Amity University",
    about: "Works on data analysis, dashboards and insights.",
    phone: "9876500005",
    email: "vivek@college.edu",
    image: "",
  },
  {
    id: 6,
    name: "Kunal Jain",
    role: "Backend Developer",
    skills: ["Node.js", "Express", "MongoDB"],
    experience: "3 Projects",
    rating: null,
    reviews: 0,
    status: "Available",
    college: "Amity University",
    about: "Handles APIs, databases and server-side development.",
    phone: "9876500006",
    email: "kunal@college.edu",
    image: "",
  },
  {
    id: 7,
    name: "Ananya Rao",
    role: "Documentation",
    skills: ["Research", "Writing", "Reports"],
    experience: "6 Projects",
    rating: null,
    reviews: 0,
    status: "Available",
    college: "Amity University",
    about: "Creates clear documentation and project reports.",
    phone: "9876500007",
    email: "ananya@college.edu",
    image: "",
  },
];

const emptyMember = {
  name: "",
  role: "Coder",
  skills: "",
  experience: "",
  college: "",
  about: "",
  phone: "",
  email: "",
  image: "",
  status: "Available",
};

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("unitrade-theme") || "dark";
  });

  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem("unitrade-products-v2");
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("unitrade-wishlist-v2")) || [];
    } catch {
      return [];
    }
  });
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");

  const [showSell, setShowSell] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showTeamFinder, setShowTeamFinder] = useState(false);

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("unitrade-user-v2")) || null;
    } catch {
      return null;
    }
  });
  const [toast, setToast] = useState("");

  const [teamRole, setTeamRole] = useState("All Roles");
  const [teamSearch, setTeamSearch] = useState("");
  const [selectedTeammate, setSelectedTeammate] = useState(null);

  const [members, setMembers] = useState(() => {
    try {
      const saved = localStorage.getItem("unitrade-members-v2");
      return saved ? JSON.parse(saved) : defaultTeammates;
    } catch {
      return defaultTeammates;
    }
  });
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [memberForm, setMemberForm] = useState(emptyMember);
  const [memberImagePreview, setMemberImagePreview] = useState("");
  const [editingMemberId, setEditingMemberId] = useState(null);

  const [invitedMembers, setInvitedMembers] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("unitrade-invites-v2")) || [];
    } catch {
      return [];
    }
  });
  const [reviews, setReviews] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("unitrade-reviews-v2")) || {};
    } catch {
      return {};
    }
  });
  const [reviewTarget, setReviewTarget] = useState(null);
  const [reviewStars, setReviewStars] = useState(5);
  const [reviewText, setReviewText] = useState("");

  const [authMode, setAuthMode] = useState("choice");
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState("");

  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [form, setForm] = useState({
    title: "",
    category: "Books",
    description: "",
    condition: "Good",
    price: "",
    seller: "",
    phone: "",
    email: "",
    image: "",
    location: "",
  });

  useEffect(() => {
    localStorage.setItem("unitrade-theme", theme);
    document.body.className = theme === "light" ? "light-mode" : "dark-mode";
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("unitrade-products-v2", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("unitrade-members-v2", JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem("unitrade-wishlist-v2", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (user) localStorage.setItem("unitrade-user-v2", JSON.stringify(user));
    else localStorage.removeItem("unitrade-user-v2");
  }, [user]);

  useEffect(() => {
    localStorage.setItem("unitrade-invites-v2", JSON.stringify(invitedMembers));
  }, [invitedMembers]);

  useEffect(() => {
    localStorage.setItem("unitrade-reviews-v2", JSON.stringify(reviews));
  }, [reviews]);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));

    notify(
      theme === "dark"
        ? "Day mode enabled ☀️"
        : "Dark mode enabled 🌙"
    );
  };

  const notify = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2200);
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const toggleWishlist = (id) => {
    const exists = wishlist.includes(id);

    setWishlist((current) =>
      exists
        ? current.filter((item) => item !== id)
        : [...current, id]
    );

    notify(
      exists
        ? "Removed from wishlist"
        : "Added to wishlist ❤️"
    );
  };

  const filteredProducts = products.filter((product) => {
    const text = search.toLowerCase();

    const matchesSearch =
      product.title.toLowerCase().includes(text) ||
      product.description.toLowerCase().includes(text) ||
      product.category.toLowerCase().includes(text);

    const matchesCategory =
      category === "All Categories" ||
      product.category === category;

    return matchesSearch && matchesCategory;
  });

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      notify("Please select an image file");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setForm((current) => ({
        ...current,
        image: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleMemberImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      notify("Please select an image file");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setMemberImagePreview(reader.result);

      setMemberForm((current) => ({
        ...current,
        image: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleSell = (e) => {
    e.preventDefault();

    if (
      !form.title ||
      !form.description ||
      !form.seller ||
      !form.phone ||
      !form.email ||
      !form.image ||
      !form.location
    ) {
      notify("Please fill all required fields");
      return;
    }

    const newProduct = {
      id: Date.now(),
      ownerEmail: user?.email || form.email,
      icon:
        form.category === "Books"
          ? "📘"
          : form.category === "Notes"
          ? "📝"
          : form.category === "Lab Equipment"
          ? "🧪"
          : "📦",

      ...form,

      price: form.price.trim()
        ? `₹${form.price}`
        : "Free",
    };

    setProducts((current) => [
      newProduct,
      ...current,
    ]);

    setForm({
      title: "",
      category: "Books",
      description: "",
      condition: "Good",
      price: "",
      seller: "",
      phone: "",
      email: "",
      image: "",
      location: "",
    });

    setShowSell(false);

    notify("Your item has been listed successfully! 🎉");

    setTimeout(() => {
      scrollTo("marketplace");
    }, 200);
  };

  const sendOtp = (e) => {
    e.preventDefault();

    if (
      !authForm.name ||
      !authForm.email ||
      !authForm.phone
    ) {
      notify("Please enter all details");
      return;
    }

    const demoOtp = "123456";

    setOtpSent(demoOtp);
    setOtp("");
    setOtpStep(true);

    notify("Demo OTP sent. Use 123456");
  };

  const verifyOtp = (e) => {
    e.preventDefault();

    if (otp !== otpSent) {
      notify("Invalid OTP. Use 123456");
      return;
    }

    setUser({
      name: authForm.name,
      email: authForm.email,
      phone: authForm.phone,
    });

    setShowLogin(false);
    setOtpStep(false);
    setAuthMode("choice");

    notify(`Welcome to UniTrade, ${authForm.name}! 🎓`);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();

    if (!name || !email) {
      notify("Please enter name and email");
      return;
    }

    setUser({
      name,
      email,
    });

    setShowLogin(false);

    notify(`Welcome back, ${name}! 🎓`);
  };

  const googleDemoLogin = () => {
    notify("Google login demo opened");
    setAuthMode("email");
  };

  const logout = () => {
    setUser(null);
    notify("Logged out successfully");
  };

  const filteredTeammates = members.filter((person) => {
    const roleMatch =
      teamRole === "All Roles" ||
      person.role === teamRole;

    const text =
      `${person.name} ${person.role} ${person.skills.join(" ")}`.toLowerCase();

    return (
      roleMatch &&
      text.includes(teamSearch.toLowerCase())
    );
  });

  const openMemberForm = (member = null) => {
    if (!user) {
      setShowLogin(true);
      notify("Create an account first");
      return;
    }

    if (member) {
      setEditingMemberId(member.id);
      setMemberForm({
        name: member.name || "",
        role: member.role || "Coder",
        skills: Array.isArray(member.skills) ? member.skills.join(", " ) : "",
        experience: member.experience || "",
        college: member.college || "",
        about: member.about || "",
        phone: member.phone || "",
        email: member.email || user.email || "",
        image: member.image || "",
        status: member.status || "Available",
      });
      setMemberImagePreview(member.image || "");
    } else {
      setEditingMemberId(null);
      // New team member form should always start completely blank.
      // Existing profile data is loaded only when editing that profile.
      setMemberForm({ ...emptyMember });
      setMemberImagePreview("");
    }
    setShowMemberForm(true);
  };

  const addMember = (e) => {
    e.preventDefault();

    if (
      !memberForm.name ||
      !memberForm.email ||
      !memberForm.phone ||
      !memberForm.skills ||
      !memberForm.about
    ) {
      notify("Please fill name, email, phone, skills and about");
      return;
    }

    const profileData = {
      name: memberForm.name.trim(),
      role: memberForm.role,
      skills: memberForm.skills.split(",").map((s) => s.trim()).filter(Boolean),
      experience: memberForm.experience || "New to Hackathons",
      college: memberForm.college || "College Student",
      status: memberForm.status,
      phone: memberForm.phone,
      email: memberForm.email,
      about: memberForm.about.trim(),
      image: memberImagePreview || memberForm.image || "",
    };

    if (editingMemberId !== null) {
      setMembers((current) =>
        current.map((member) =>
          member.id === editingMemberId
            ? { ...member, ...profileData }
            : member
        )
      );
      setShowMemberForm(false);
      setEditingMemberId(null);
      setMemberForm(emptyMember);
      setMemberImagePreview("");
      notify("Your team profile was updated successfully! ✨");
      return;
    }

    const newMember = {
      ...profileData,
      id: Date.now(),
      ownerEmail: user?.email,
      rating: null,
      reviews: 0,
    };

    setMembers((current) => [...current, newMember]);
    setMemberForm(emptyMember);
    setMemberImagePreview("");
    setShowMemberForm(false);
    notify("Team profile added successfully! 🎉");
  };

  const deleteMember = (person) => {
    if (!user) {
      setShowLogin(true);
      notify("Please login before deleting a team profile");
      return;
    }

    const confirmed = window.confirm(
      `Delete ${person.name}'s team profile? This cannot be undone.`
    );
    if (!confirmed) return;

    setMembers((current) => current.filter((member) => member.id !== person.id));
    setInvitedMembers((current) => current.filter((id) => id !== person.id));
    setReviews((current) => {
      const next = { ...current };
      delete next[person.id];
      return next;
    });
    setSelectedTeammate(null);
    notify("Your team profile was deleted");
  };

  const inviteMember = (person) => {
    if (!user) {
      setShowLogin(true);
      notify("Please login before sending invite");
      return;
    }

    setInvitedMembers((current) =>
      current.includes(person.id)
        ? current
        : [...current, person.id]
    );

    notify(
      `Team invite sent to ${person.name}! 🤝`
    );
  };

  const openReview = (person) => {
    if (!invitedMembers.includes(person.id)) {
      notify("Review unlocks after inviting teammate");
      return;
    }

    setReviewTarget(person);
    setReviewStars(5);
    setReviewText("");
  };

  const submitReview = (e) => {
    e.preventDefault();

    if (!reviewTarget || !reviewText.trim()) {
      notify("Please write a review");
      return;
    }

    const newReview = {
      id: Date.now(),
      stars: reviewStars,
      text: reviewText.trim(),
      by: user?.name || "Student",
    };

    setReviews((current) => ({
      ...current,

      [reviewTarget.id]: [
        ...(current[reviewTarget.id] || []),
        newReview,
      ],
    }));

    setMembers((current) =>
      current.map((member) => {
        if (member.id !== reviewTarget.id) {
          return member;
        }

        const previousReviews = reviews[member.id] || [];
        const allRatings = [
          ...previousReviews.map((review) => review.stars),
          reviewStars,
        ];
        const average =
          allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length;

        return {
          ...member,
          rating: Number(average.toFixed(1)),
          reviews: (member.reviews || 0) + 1,
        };
      })
    );

    setReviewTarget(null);

    notify("Review submitted successfully! ⭐");
  };

  const memberReviews = reviewTarget
    ? reviews[reviewTarget.id] || []
    : [];

  const roleButtons = [
    ["💻", "Coder"],
    ["🎤", "Presenter"],
    ["🎨", "Frontend Developer"],
    ["⚙️", "Backend Developer"],
    ["📊", "Data Analyst"],
    ["🖌️", "UI/UX Designer"],
    ["📝", "Documentation"],
  ];

  return (
    <div className={`app ${theme}`}>

      {/* NAVBAR */}
      <nav className="navbar">

        <div
          className="logo"
          onClick={() => scrollTo("home")}
        >
          <span className="logo-mark">♻</span>
          UniTrade
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#marketplace">Marketplace</a>
          <a href="#resources">Notes & PYQs</a>
          <a href="#team-finder">🤝 Team Finder</a>
          <a href="#how">How It Works</a>
          <a href="#about">About</a>
        </div>

        <div className="nav-actions">

          <button
            className="theme-btn"
            onClick={toggleTheme}
            title="Toggle Day/Night Mode"
          >
            {theme === "dark" ? "☀️ Day" : "🌙 Night"}
          </button>

          <button
            className="admin-nav"
            onClick={() => setShowAdmin(true)}
          >
            ⚙️ Admin
          </button>

          <button
            className="wishlist-nav"
            onClick={() => setShowWishlist(true)}
          >
            ❤️ {wishlist.length}
          </button>

          {user ? (
            <button
              className="login-btn"
              onClick={logout}
            >
              {user.name} · Logout
            </button>
          ) : (
            <button
              className="login-btn"
              onClick={() => {
                setAuthMode("choice");
                setOtpStep(false);
                setShowLogin(true);
              }}
            >
              Sign Up / Login
            </button>
          )}

        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="home">

        <div className="hero-content">

          <div className="badge">
            🎓 STUDENT-ONLY MARKETPLACE
          </div>

          <h1>
            Buy Smart.
            <br />
            <span>Sell Smart.</span>
            <br />
            Reuse Smart.
          </h1>

          <p>
            UniTrade connects students to buy and sell
            used academic materials within their campus.
            Save money, reduce waste and help fellow
            students.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={() => scrollTo("marketplace")}
            >
              Browse Marketplace →
            </button>

            <button
              className="outline-btn"
              onClick={() => setShowSell(true)}
            >
              + Sell an Item
            </button>

            <button
              className="team-btn"
              onClick={() => scrollTo("team-finder")}
            >
              🤝 Find Teammates
            </button>

          </div>

          <div className="hero-stats">

            <div>
              <strong>500+</strong>
              <span>Students</span>
            </div>

            <div>
              <strong>{products.length + 116}+</strong>
              <span>Listings</span>
            </div>

            <div>
              <strong>80+</strong>
              <span>Items Reused</span>
            </div>

          </div>

        </div>

        <div className="hero-visual">

          <div className="floating-card card-one">
            <span>📚</span>
            <div>
              <strong>Engineering Books</strong>
              <small>Student Collection</small>
            </div>
          </div>

          <div className="main-circle">
            ♻
          </div>

          <div className="floating-card card-two">
            <span>🧪</span>
            <div>
              <strong>Lab Equipment</strong>
              <small>Student Verified</small>
            </div>
          </div>

        </div>

      </section>

      {/* FEATURES */}
      <section className="features">

        <div className="feature">
          <div className="feature-icon">💰</div>
          <h3>Save Money</h3>
          <p>
            Get academic materials at affordable prices.
          </p>
        </div>

        <div className="feature">
          <div className="feature-icon">♻️</div>
          <h3>Reduce Waste</h3>
          <p>
            Give your unused materials a second life.
          </p>
        </div>

        <div className="feature">
          <div className="feature-icon">🎓</div>
          <h3>Students Only</h3>
          <p>
            Connect safely with students from your campus.
          </p>
        </div>

        <div className="feature">
          <div className="feature-icon">📍</div>
          <h3>Campus Pickup</h3>
          <p>
            Easy hand-to-hand exchange inside campus.
          </p>
        </div>

      </section>

      {/* MARKETPLACE */}
      <section
        className="marketplace section"
        id="marketplace"
      >

        <div className="section-heading">
          <span>MARKETPLACE</span>
          <h2>Find What You Need</h2>
          <p>
            Books, notes, lab equipment and more.
          </p>
        </div>

        <div className="search-box">

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="🔍 Search academic materials..."
          />

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          >
            <option>All Categories</option>
            <option>Books</option>
            <option>Notes</option>
            <option>Lab Equipment</option>
            <option>Graphics</option>
          </select>

          <button
            onClick={() => scrollTo("product-grid")}
          >
            Search
          </button>

        </div>

        <div className="marketplace-top">

          <span>
            {filteredProducts.length} items found
          </span>

          <button
            className="small-sell-btn"
            onClick={() => setShowSell(true)}
          >
            + List Your Item
          </button>

        </div>

        <div
          className="product-grid"
          id="product-grid"
        >

          {filteredProducts.length ? (
            filteredProducts.map((product) => (
              <div
                className="product-card"
                key={product.id}
              >

                <button
                  className={`heart-btn ${
                    wishlist.includes(product.id)
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    toggleWishlist(product.id)
                  }
                >
                  {wishlist.includes(product.id)
                    ? "❤️"
                    : "♡"}
                </button>

                <div className="product-image">

                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.title}
                    />
                  ) : (
                    <span>{product.icon}</span>
                  )}

                </div>

                <div className="product-info">

                  <span className="product-category">
                    {product.category}
                  </span>

                  <h3>{product.title}</h3>

                  <p>{product.description}</p>

                  <div className="product-meta">
                    <small>
                      📍 {product.location}
                    </small>

                    <small>
                      {product.condition}
                    </small>
                  </div>

                  <div className="product-bottom">

                    <strong>{product.price}</strong>

                    <button
                      onClick={() =>
                        setSelectedProduct(product)
                      }
                    >
                      View
                    </button>

                  </div>

                </div>

              </div>
            ))
          ) : (
            <div className="empty-state">
              <div>🔎</div>
              <h3>No items found</h3>
              <p>
                Try another search or category.
              </p>
            </div>
          )}

        </div>

      </section>

      {/* TEAM FINDER */}
      <section
        className="team-finder section"
        id="team-finder"
      >

        <div className="section-heading">
          <span>HACKATHON TEAM FINDER</span>

          <h2>Find the Right Teammate</h2>

          <p>
            Need a coder, presenter, developer,
            analyst or designer? Find students with
            the skills you need.
          </p>
        </div>

        <div className="team-tools">

          <input
            value={teamSearch}
            onChange={(e) =>
              setTeamSearch(e.target.value)
            }
            placeholder="🔍 Search by name or skill..."
          />

          <select
            value={teamRole}
            onChange={(e) =>
              setTeamRole(e.target.value)
            }
          >
            <option>All Roles</option>
            <option>Coder</option>
            <option>Presenter</option>
            <option>Frontend Developer</option>
            <option>Backend Developer</option>
            <option>Data Analyst</option>
            <option>UI/UX Designer</option>
            <option>Documentation</option>
          </select>

          <button
            onClick={() => setShowTeamFinder(true)}
          >
            Open Team Finder
          </button>

        </div>

        <div className="team-profile-add">

          <button
            className="primary-btn"
            onClick={() => openMemberForm()}
          >
            ＋ Add Another Team Member
          </button>

        </div>

        <div className="role-pills">

          {roleButtons.map(([icon, role]) => (
            <button
              key={role}
              onClick={() => setTeamRole(role)}
              className={
                teamRole === role
                  ? "role-active"
                  : ""
              }
            >
              {icon} {role}
            </button>
          ))}

        </div>

        <div className="team-grid">

          {filteredTeammates.map((person) => (

            <div
              className="team-card"
              key={person.id}
            >

              {person.image ? (
                <img
                  className="team-photo"
                  src={person.image}
                  alt={person.name}
                />
              ) : (
                <div className="team-avatar">
                  {person.name.charAt(0)}
                </div>
              )}

              <div className="team-card-head">

                <div>
                  <h3>{person.name}</h3>
                  <span>{person.role}</span>
                </div>

                <b
                  className={
                    person.status === "Available"
                      ? "available"
                      : "busy"
                  }
                >
                  ● {person.status}
                </b>

              </div>

              <div className="team-skills">

                {person.skills.map((skill) => (
                  <span key={skill}>
                    {skill}
                  </span>
                ))}

              </div>

              <div className="team-meta">

                <span>
                  {person.rating == null
                    ? "New"
                    : `⭐ ${person.rating}`}
                </span>

                <span>
                  🏆 {person.experience}
                </span>

              </div>

              <p>{person.about}</p>

              <div className="contact-mini">
                📧 {person.email}
              </div>

              <div className="team-actions">

                <button
                  onClick={() =>
                    setSelectedTeammate(person)
                  }
                >
                  View Profile
                </button>

                <button
                  className="invite-btn"
                  onClick={() =>
                    inviteMember(person)
                  }
                >
                  {invitedMembers.includes(person.id)
                    ? "✓ Invited"
                    : "🤝 Invite"}
                </button>

              </div>

              <div className="owner-actions">
                <button
                  className="edit-profile-btn"
                  onClick={() => openMemberForm(person)}
                >
                  ✎ Edit
                </button>
                <button
                  className="delete-profile-btn"
                  onClick={() => deleteMember(person)}
                >
                  🗑 Delete
                </button>
              </div>

              {invitedMembers.includes(person.id) && (
                <button
                  className="review-btn"
                  onClick={() =>
                    openReview(person)
                  }
                >
                  ⭐ Give Review
                </button>
              )}

            </div>

          ))}

        </div>

      </section>

      {/* RESOURCES */}
      <section
        className="resources section"
        id="resources"
      >

        <div className="resources-text">

          <span>FREE RESOURCES</span>

          <h2>
            Learn More.
            <br />
            Spend Less.
          </h2>

          <p>
            Access student-contributed notes,
            previous year question papers and
            academic resources for free.
          </p>

          <button
            className="primary-btn"
            onClick={() =>
              notify(
                "Resources section is ready for backend files!"
              )
            }
          >
            Explore Resources →
          </button>

        </div>

        <div className="resource-card">

          {resources.map((resource) => (

            <div
              className="resource-item"
              key={resource.title}
            >

              <span className="resource-icon">
                {resource.icon}
              </span>

              <div>
                <h3>{resource.title}</h3>
                <p>{resource.count}</p>
              </div>

              <button
                onClick={() =>
                  notify(`${resource.title} opened`)
                }
              >
                View →
              </button>

            </div>

          ))}

        </div>

      </section>

      {/* HOW IT WORKS */}
      <section
        className="how section"
        id="how"
      >

        <div className="section-heading">

          <span>HOW IT WORKS</span>

          <h2>
            Simple. Safe. Sustainable.
          </h2>

        </div>

        <div className="steps">

          {[
            [
              "01",
              "List Your Item",
              "Upload your unused books, notes or academic equipment.",
            ],
            [
              "02",
              "Student Finds It",
              "Another student searches and discovers your listing.",
            ],
            [
              "03",
              "Connect",
              "Contact the seller and decide a campus pickup point.",
            ],
            [
              "04",
              "Reuse",
              "The material gets reused instead of becoming waste.",
            ],
          ].map(([number, title, text]) => (

            <div
              className="step"
              key={number}
            >

              <div className="step-number">
                {number}
              </div>

              <h3>{title}</h3>

              <p>{text}</p>

            </div>

          ))}

        </div>

      </section>

      {/* ABOUT / IMPACT */}
      <section
        className="about section"
        id="about"
      >

        <div className="section-heading">

          <span>OUR IMPACT</span>

          <h2>
            One Campus. Less Waste.
          </h2>

        </div>

        <div className="impact-grid">

          <div>
            <strong>12K+</strong>
            <p>Estimated Student Savings</p>
          </div>

          <div>
            <strong>150+</strong>
            <p>Materials Reused</p>
          </div>

          <div>
            <strong>80kg</strong>
            <p>Estimated Waste Avoided</p>
          </div>

          <div>
            <strong>300+</strong>
            <p>Students Connected</p>
          </div>

        </div>

      </section>

      {/* FOOTER */}
      <footer>

        <div className="logo">
          <span className="logo-mark">♻</span>
          UniTrade
        </div>

        <p>
          Campus Peer-to-Peer Academic Marketplace
        </p>

        <small>
          Built for Hackathon • Smart Education &
          Sustainable Campus
        </small>

      </footer>

      {/* PRODUCT MODAL */}
      {selectedProduct && (

        <div
          className="modal-overlay"
          onClick={() => setSelectedProduct(null)}
        >

          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="modal-close"
              onClick={() =>
                setSelectedProduct(null)
              }
            >
              ✕
            </button>

            <div className="modal-icon">
              {selectedProduct.image ? (
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                />
              ) : (
                selectedProduct.icon
              )}
            </div>

            <span className="form-label">
              {selectedProduct.category}
            </span>

            <h2>{selectedProduct.title}</h2>

            <p className="modal-description">
              {selectedProduct.description}
            </p>

            <div className="modal-details seller-info-panel">

              <div>
                <span>Price</span>
                <strong>
                  {selectedProduct.price}
                </strong>
              </div>

              <div>
                <span>Seller</span>
                <strong>
                  {selectedProduct.seller}
                </strong>
              </div>

              <div>
                <span>Condition</span>
                <strong>
                  {selectedProduct.condition}
                </strong>
              </div>

              <div>
                <span>Pickup</span>
                <strong>
                  {selectedProduct.location}
                </strong>
              </div>

              <div>
                <span>Contact</span>
                <strong>
                  {selectedProduct.phone}
                </strong>
              </div>

              <div>
                <span>Email</span>
                <strong>
                  {selectedProduct.email}
                </strong>
              </div>

            </div>

            <button
              className="connect-btn"
              onClick={() => {
                setSelectedProduct(null);
                notify(
                  "Seller connection request sent! 🤝"
                );
              }}
            >
              Connect with Seller →
            </button>

          </div>

        </div>
      )}

      {/* SELL MODAL */}
      {showSell && (

        <div
          className="modal-overlay"
          onClick={() => setShowSell(false)}
        >

          <div
            className="form-card"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="modal-close"
              onClick={() => setShowSell(false)}
            >
              ✕
            </button>

            <span className="form-label">
              SELL AN ITEM
            </span>

            <h2>
              List Your Academic Material
            </h2>

            <p className="form-subtitle">
              Help another student reuse what you
              no longer need.
            </p>

            <form onSubmit={handleSell}>

              <div className="form-grid">

                <label>
                  Item Name *
                  <input
                    value={form.title}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        title: e.target.value,
                      })
                    }
                    placeholder="e.g. Data Structures Book"
                  />
                </label>

                <label>
                  Category
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        category: e.target.value,
                      })
                    }
                  >
                    <option>Books</option>
                    <option>Notes</option>
                    <option>Lab Equipment</option>
                    <option>Graphics</option>
                  </select>
                </label>

                <label>
                  Condition
                  <select
                    value={form.condition}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        condition: e.target.value,
                      })
                    }
                  >
                    <option>Like New</option>
                    <option>Excellent</option>
                    <option>Good</option>
                    <option>Used</option>
                  </select>
                </label>

                <label>
                  Price
                  <input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        price: e.target.value,
                      })
                    }
                    placeholder="Leave empty for Free"
                  />
                </label>

                <label>
                  Seller Name *
                  <input
                    value={form.seller}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        seller: e.target.value,
                      })
                    }
                    placeholder="Your name"
                  />
                </label>

                <label>
                  Contact Number *
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        phone: e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10),
                      })
                    }
                    placeholder="10-digit mobile number"
                  />
                </label>

                <label>
                  College Email *
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        email: e.target.value,
                      })
                    }
                    placeholder="student@college.edu"
                  />
                </label>

                <label>
                  Item Photo *
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>

                <label>
                  Campus Pickup *
                  <input
                    value={form.location}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        location: e.target.value,
                      })
                    }
                    placeholder="e.g. Block A"
                  />
                </label>

              </div>

              {form.image && (
                <div className="upload-preview-wrap">
                  <span>Photo Preview</span>

                  <img
                    className="upload-preview"
                    src={form.image}
                    alt="Item preview"
                  />
                </div>
              )}

              <label>
                Description *
                <textarea
                  rows="4"
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe your item..."
                />
              </label>

              <button
                className="primary-btn form-submit"
                type="submit"
              >
                Publish Listing →
              </button>

            </form>

          </div>

        </div>
      )}

      {/* LOGIN */}
      {showLogin && (

        <div
          className="modal-overlay"
          onClick={() => setShowLogin(false)}
        >

          <div
            className="form-card auth-card"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="modal-close"
              onClick={() => setShowLogin(false)}
            >
              ✕
            </button>

            {!otpStep &&
              authMode === "choice" && (
                <>
                  <div className="login-icon">
                    🎓
                  </div>

                  <span className="form-label">
                    CREATE ACCOUNT
                  </span>

                  <h2>Join UniTrade</h2>

                  <p className="form-subtitle">
                    Create an account using Google
                    or verify your phone with OTP.
                  </p>

                  <button
                    className="google-btn"
                    onClick={googleDemoLogin}
                  >
                    G&nbsp; Continue with Google
                  </button>

                  <button
                    className="outline-full"
                    onClick={() =>
                      setAuthMode("email")
                    }
                  >
                    📱 Create Account with OTP
                  </button>

                  <div className="auth-divider">
                    OR
                  </div>

                  <button
                    className="text-btn"
                    onClick={() =>
                      setAuthMode("old-login")
                    }
                  >
                    Already have an account? Login
                  </button>
                </>
              )}

            {!otpStep &&
              authMode === "email" && (
                <>
                  <span className="form-label">
                    SIGN UP WITH OTP
                  </span>

                  <h2>Create Account</h2>

                  <form onSubmit={sendOtp}>

                    <label>
                      Name
                      <input
                        value={authForm.name}
                        onChange={(e) =>
                          setAuthForm({
                            ...authForm,
                            name: e.target.value,
                          })
                        }
                        placeholder="Your full name"
                      />
                    </label>

                    <label>
                      Email
                      <input
                        type="email"
                        value={authForm.email}
                        onChange={(e) =>
                          setAuthForm({
                            ...authForm,
                            email: e.target.value,
                          })
                        }
                        placeholder="student@college.edu"
                      />
                    </label>

                    <label>
                      Mobile Number
                      <input
                        value={authForm.phone}
                        onChange={(e) =>
                          setAuthForm({
                            ...authForm,
                            phone: e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 10),
                          })
                        }
                        placeholder="10-digit mobile number"
                      />
                    </label>

                    <button
                      className="primary-btn form-submit"
                      type="submit"
                    >
                      Send OTP →
                    </button>

                  </form>

                  <button
                    className="text-btn"
                    onClick={() =>
                      setAuthMode("choice")
                    }
                  >
                    ← Back
                  </button>
                </>
              )}

            {!otpStep &&
              authMode === "old-login" && (
                <>
                  <span className="form-label">
                    LOGIN
                  </span>

                  <h2>Welcome Back</h2>

                  <form onSubmit={handleLogin}>

                    <label>
                      Student Name
                      <input
                        name="name"
                        placeholder="Enter your name"
                      />
                    </label>

                    <label>
                      College Email
                      <input
                        name="email"
                        type="email"
                        placeholder="student@college.edu"
                      />
                    </label>

                    <button
                      className="primary-btn form-submit"
                      type="submit"
                    >
                      Login & Continue →
                    </button>

                  </form>

                  <button
                    className="text-btn"
                    onClick={() =>
                      setAuthMode("choice")
                    }
                  >
                    ← Other login options
                  </button>
                </>
              )}

            {otpStep && (
              <>
                <div className="login-icon">
                  🔐
                </div>

                <span className="form-label">
                  VERIFY OTP
                </span>

                <h2>Enter OTP</h2>

                <p className="form-subtitle">
                  Demo OTP:
                  <strong> 123456</strong>
                </p>

                <form onSubmit={verifyOtp}>

                  <input
                    className="otp-input"
                    maxLength="6"
                    value={otp}
                    onChange={(e) =>
                      setOtp(
                        e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 6)
                      )
                    }
                    placeholder="Enter 6-digit OTP"
                  />

                  <button
                    className="primary-btn form-submit"
                    type="submit"
                  >
                    Verify & Sign In →
                  </button>

                </form>

                <button
                  className="text-btn"
                  onClick={() =>
                    setOtpStep(false)
                  }
                >
                  ← Change details
                </button>
              </>
            )}

          </div>

        </div>
      )}

      {/* WISHLIST */}
      {showWishlist && (

        <div
          className="modal-overlay"
          onClick={() => setShowWishlist(false)}
        >

          <div
            className="form-card wishlist-card"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="modal-close"
              onClick={() =>
                setShowWishlist(false)
              }
            >
              ✕
            </button>

            <span className="form-label">
              MY WISHLIST
            </span>

            <h2>Saved Items ❤️</h2>

            {products.filter((p) =>
              wishlist.includes(p.id)
            ).length ? (

              <div className="wishlist-list">

                {products
                  .filter((p) =>
                    wishlist.includes(p.id)
                  )
                  .map((p) => (

                    <div
                      className="wishlist-item"
                      key={p.id}
                    >

                      <span>{p.icon}</span>

                      <div>
                        <strong>{p.title}</strong>
                        <small>{p.price}</small>
                      </div>

                      <button
                        onClick={() =>
                          setSelectedProduct(p)
                        }
                      >
                        View
                      </button>

                    </div>

                  ))}

              </div>

            ) : (

              <div className="empty-wishlist">

                <div>♡</div>

                <p>
                  Your wishlist is empty.
                </p>

                <small>
                  Tap the heart on any product
                  to save it.
                </small>

              </div>

            )}

          </div>

        </div>
      )}

      {/* ADD TEAM PROFILE */}
      {showMemberForm && (

        <div
          className="modal-overlay"
          onClick={() =>
            setShowMemberForm(false)
          }
        >

          <div
            className="form-card"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="modal-close"
              onClick={() =>
                setShowMemberForm(false)
              }
            >
              ✕
            </button>

            <span className="form-label">
              TEAM PROFILE
            </span>

            <h2>{editingMemberId !== null ? "Edit Your Profile" : "Add Your Profile"}</h2>

            <p className="form-subtitle">
              Show other students what you can
              contribute to a project or hackathon.
            </p>

            <form onSubmit={addMember}>

              <div className="form-grid">

                <label>
                  Name *
                  <input
                    value={memberForm.name}
                    onChange={(e) =>
                      setMemberForm({
                        ...memberForm,
                        name: e.target.value,
                      })
                    }
                    placeholder="Your name"
                  />
                </label>

                <label>
                  Role
                  <select
                    value={memberForm.role}
                    onChange={(e) =>
                      setMemberForm({
                        ...memberForm,
                        role: e.target.value,
                      })
                    }
                  >
                    <option>Coder</option>
                    <option>Presenter</option>
                    <option>Frontend Developer</option>
                    <option>Backend Developer</option>
                    <option>Data Analyst</option>
                    <option>UI/UX Designer</option>
                    <option>Documentation</option>
                  </select>
                </label>

                <label>
                  Skills *
                  <input
                    value={memberForm.skills}
                    onChange={(e) =>
                      setMemberForm({
                        ...memberForm,
                        skills: e.target.value,
                      })
                    }
                    placeholder="C++, Python, DSA"
                  />
                </label>

                <label>
                  Experience
                  <input
                    value={memberForm.experience}
                    onChange={(e) =>
                      setMemberForm({
                        ...memberForm,
                        experience: e.target.value,
                      })
                    }
                    placeholder="2 Hackathons"
                  />
                </label>

                <label>
                  College
                  <input
                    value={memberForm.college}
                    onChange={(e) =>
                      setMemberForm({
                        ...memberForm,
                        college: e.target.value,
                      })
                    }
                    placeholder="Your college"
                  />
                </label>

                <label>
                  Availability
                  <select
                    value={memberForm.status}
                    onChange={(e) =>
                      setMemberForm({
                        ...memberForm,
                        status: e.target.value,
                      })
                    }
                  >
                    <option>Available</option>
                    <option>Busy</option>
                  </select>
                </label>

                <label>
                  Contact Number *
                  <input
                    value={memberForm.phone}
                    onChange={(e) =>
                      setMemberForm({
                        ...memberForm,
                        phone: e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10),
                      })
                    }
                    placeholder="10-digit number"
                  />
                </label>

                <label>
                  Email *
                  <input
                    type="email"
                    value={memberForm.email}
                    onChange={(e) =>
                      setMemberForm({
                        ...memberForm,
                        email: e.target.value,
                      })
                    }
                    placeholder="student@college.edu"
                  />
                </label>

                <label>
                  Profile Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMemberImage}
                  />
                </label>

              </div>

              {memberImagePreview && (
                <img
                  className="profile-upload-preview"
                  src={memberImagePreview}
                  alt="Profile preview"
                />
              )}

              <label>
                About You *
                <textarea
                  rows="4"
                  value={memberForm.about}
                  onChange={(e) =>
                    setMemberForm({
                      ...memberForm,
                      about: e.target.value,
                    })
                  }
                  placeholder="Tell students about your strengths..."
                />
              </label>

              <button
                className="primary-btn form-submit"
                type="submit"
              >
                {editingMemberId !== null ? "Save Profile Changes →" : "Publish Team Profile →"}
              </button>

            </form>

          </div>

        </div>
      )}

      {/* TEAM PROFILE MODAL */}
      {selectedTeammate && (

        <div
          className="modal-overlay"
          onClick={() =>
            setSelectedTeammate(null)
          }
        >

          <div
            className="form-card teammate-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="modal-close"
              onClick={() =>
                setSelectedTeammate(null)
              }
            >
              ✕
            </button>

            {selectedTeammate.image ? (
              <img
                className="profile-large-photo"
                src={selectedTeammate.image}
                alt={selectedTeammate.name}
              />
            ) : (
              <div className="big-avatar">
                {selectedTeammate.name.charAt(0)}
              </div>
            )}

            <span className="form-label">
              {selectedTeammate.role.toUpperCase()}
            </span>

            <h2>{selectedTeammate.name}</h2>

            <p className="form-subtitle">
              {selectedTeammate.college} ·{" "}
              {selectedTeammate.status}
            </p>

            <div className="profile-box">
              <strong>Skills</strong>

              <div className="team-skills">
                {selectedTeammate.skills.map(
                  (skill) => (
                    <span key={skill}>
                      {skill}
                    </span>
                  )
                )}
              </div>
            </div>

            <div className="profile-box">
              <strong>Rating</strong>

              <p>
                {selectedTeammate.rating == null
                  ? "No reviews yet"
                  : `⭐ ${selectedTeammate.rating}/5 · ${
                      selectedTeammate.reviews || 0
                    } reviews`}
              </p>
            </div>

            <div className="profile-box">
              <strong>Contact</strong>

              <p>
                📱 {selectedTeammate.phone}
                <br />
                📧 {selectedTeammate.email}
              </p>
            </div>

            <div className="profile-box">
              <strong>About</strong>

              <p>{selectedTeammate.about}</p>
            </div>

            <div className="owner-actions modal-owner-actions">
              <button
                className="edit-profile-btn"
                onClick={() => {
                  const member = selectedTeammate;
                  setSelectedTeammate(null);
                  openMemberForm(member);
                }}
              >
                ✎ Edit Profile
              </button>
              <button
                className="delete-profile-btn"
                onClick={() => deleteMember(selectedTeammate)}
              >
                🗑 Delete Profile
              </button>
            </div>

            <button
              className="primary-btn form-submit"
              onClick={() =>
                inviteMember(selectedTeammate)
              }
            >
              {invitedMembers.includes(
                selectedTeammate.id
              )
                ? "✓ Invited"
                : "🤝 Invite to Team"}
            </button>

            {invitedMembers.includes(
              selectedTeammate.id
            ) && (
              <button
                className="review-btn large-review"
                onClick={() => {
                  setSelectedTeammate(null);
                  openReview(selectedTeammate);
                }}
              >
                ⭐ Give Review
              </button>
            )}

          </div>

        </div>
      )}

      {/* REVIEW */}
      {reviewTarget && (

        <div
          className="modal-overlay"
          onClick={() => setReviewTarget(null)}
        >

          <div
            className="form-card review-card"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="modal-close"
              onClick={() =>
                setReviewTarget(null)
              }
            >
              ✕
            </button>

            <span className="form-label">
              TEAM REVIEW
            </span>

            <h2>
              Review {reviewTarget.name}
            </h2>

            <p className="form-subtitle">
              Share your experience working with
              this teammate.
            </p>

            <form onSubmit={submitReview}>

              <div className="star-picker">

                {[1, 2, 3, 4, 5].map((star) => (

                  <button
                    type="button"
                    key={star}
                    className={
                      star <= reviewStars
                        ? "star-active"
                        : "star-off"
                    }
                    onClick={() =>
                      setReviewStars(star)
                    }
                  >
                    ★
                  </button>

                ))}

              </div>

              <textarea
                rows="4"
                value={reviewText}
                onChange={(e) =>
                  setReviewText(e.target.value)
                }
                placeholder="Write your review..."
              />

              <button
                className="primary-btn form-submit"
                type="submit"
              >
                Submit Review →
              </button>

            </form>

            {memberReviews.length > 0 && (

              <div className="review-history">

                <h3>Previous Reviews</h3>

                {memberReviews.map((review) => (

                  <div
                    className="review-item"
                    key={review.id}
                  >
                    <strong>
                      ⭐ {review.stars}/5 ·{" "}
                      {review.by}
                    </strong>

                    <p>{review.text}</p>
                  </div>

                ))}

              </div>

            )}

          </div>

        </div>
      )}

      {/* TEAM FINDER MODAL */}
      {showTeamFinder && (

        <div
          className="modal-overlay"
          onClick={() =>
            setShowTeamFinder(false)
          }
        >

          <div
            className="form-card"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="modal-close"
              onClick={() =>
                setShowTeamFinder(false)
              }
            >
              ✕
            </button>

            <span className="form-label">
              TEAM MATCHING
            </span>

            <h2>Who do you need?</h2>

            <p className="form-subtitle">
              Choose the role you need for your
              project or hackathon.
            </p>

            <div className="role-select-grid">

              {roleButtons.map(([icon, role]) => (

                <button
                  key={role}
                  className={
                    teamRole === role
                      ? "selected-role"
                      : ""
                  }
                  onClick={() => {
                    setTeamRole(role);
                    setShowTeamFinder(false);
                    scrollTo("team-finder");
                  }}
                >
                  {icon} {role}
                </button>

              ))}

            </div>

          </div>

        </div>
      )}

      {/* ADMIN */}
      {showAdmin && (

        <div
          className="modal-overlay"
          onClick={() => setShowAdmin(false)}
        >

          <div
            className="form-card admin-card"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="modal-close"
              onClick={() => setShowAdmin(false)}
            >
              ✕
            </button>

            <span className="form-label">
              ADMIN DASHBOARD
            </span>

            <h2>UniTrade Admin Panel</h2>

            <p className="form-subtitle">
              Manage marketplace activity from one
              place.
            </p>

            <div className="admin-stats">

              <div>
                <strong>{products.length}</strong>
                <span>Total Listings</span>
              </div>

              <div>
                <strong>
                  {
                    new Set(
                      products.map(
                        (product) => product.seller
                      )
                    ).size
                  }
                </strong>
                <span>Sellers</span>
              </div>

              <div>
                <strong>{wishlist.length}</strong>
                <span>Wishlist Saves</span>
              </div>

            </div>

            <h3 className="admin-heading">
              Recent Listings
            </h3>

            <div className="admin-list">

              {products
                .slice(0, 8)
                .map((product) => (

                  <div
                    className="admin-row"
                    key={product.id}
                  >

                    <div className="admin-row-icon">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt=""
                        />
                      ) : (
                        product.icon
                      )}
                    </div>

                    <div className="admin-row-info">
                      <strong>
                        {product.title}
                      </strong>

                      <small>
                        {product.seller} ·{" "}
                        {product.price}
                      </small>
                    </div>

                    <button
                      className="admin-remove"
                      onClick={() => {
                        setProducts((items) =>
                          items.filter(
                            (item) =>
                              item.id !== product.id
                          )
                        );

                        notify(
                          "Listing removed by admin"
                        );
                      }}
                    >
                      Remove
                    </button>

                  </div>

                ))}

            </div>

          </div>

        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className="toast">
          {toast}
        </div>
      )}

    </div>
  );
}

export default App;