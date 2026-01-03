from typing import List, Optional
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Field, Session, SQLModel, create_engine, select
from datetime import date

# --- DATABASE SETUP ---
DATABASE_URL = "sqlite:///./nexus_finance.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

def get_session():
    with Session(engine) as session:
        yield session

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

# --- MODELS ---
class Expense(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    amount: float
    category: str
    note: str
    date: date

class Grocery(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    quantity: float
    unit: str
    price: float
    date: date

class Habit(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    habit: str
    active: bool = True
    streak: int = 0
    last_completed: Optional[date] = None

class DashboardStats(SQLModel):
    total_expenses: float
    grocery_total: float
    habits_count: int

# --- FASTAPI APP ---
app = FastAPI()

# --- CORS MIDDLEWARE (Required for Vercel to talk to Render) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# --- ROOT ROUTE (Fixes 404 Error) ---
@app.get("/")
def read_root():
    return {"message": "Nexus Finance Backend is Running!"}

# --- ENDPOINTS ---

@app.post("/expenses/")
def create_expense(expense: Expense, session: Session = Depends(get_session)):
    # No-Spend Day Check (Logic Placeholder)
    habit = session.exec(select(Habit).where(Habit.habit == "No Spend Day")).first()
    if habit and habit.active:
        raise HTTPException(status_code=403, detail="No-Spend Day is active!")
    
    session.add(expense)
    session.commit()
    session.refresh(expense)
    return expense

@app.get("/expenses/", response_model=List[Expense])
def read_expenses(session: Session = Depends(get_session)):
    expenses = session.exec(select(Expense)).all()
    return expenses

@app.post("/groceries/")
def create_grocery(grocery: Grocery, session: Session = Depends(get_session)):
    session.add(grocery)
    
    # Auto-add to expenses
    expense = Expense(
        amount=grocery.price * grocery.quantity,
        category="Groceries",
        note=f"{grocery.name} ({grocery.quantity} {grocery.unit})",
        date=grocery.date
    )
    session.add(expense)
    session.commit()
    return {"status": "Grocery and Expense logged"}

@app.get("/stats/", response_model=DashboardStats)
def get_stats(session: Session = Depends(get_session)):
    expenses = session.exec(select(Expense)).all()
    total = sum(e.amount for e in expenses)
    grocery_total = sum(e.amount for e in expenses if e.category == "Groceries")
    habits = session.exec(select(Habit).where(Habit.active == True)).all()
    
    return DashboardStats(
        total_expenses=total,
        grocery_total=grocery_total,
        habits_count=len(habits)
    )

@app.post("/habits/toggle/{habit_id}")
def toggle_habit(habit_id: int, session: Session = Depends(get_session)):
    habit = session.get(Habit, habit_id)
    if not habit: raise HTTPException(status_code=404)
    habit.active = not habit.active
    session.add(habit)
    session.commit()
    return habit
