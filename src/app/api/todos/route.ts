import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Todo from '@/models/Todo';
 
export async function GET() {
  await connectToDatabase();
  const todos = await Todo.find({});
  return NextResponse.json(todos);
}

export async function POST(request: Request) {
  const { text } = await request.json();
  await connectToDatabase();
  const todo = new Todo({
    text,
  });
  await todo.save();
  return NextResponse.json(todo);
}

// New DELETE function
export async function DELETE(request: Request) {
  const { id } = await request.json();
  await connectToDatabase();
  const todo = await Todo.findByIdAndDelete(id);
  if (!todo) {
    return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
  }
  return NextResponse.json({ message: 'Todo deleted successfully' });
}

// Yeni PUT fonksiyonu
export async function PUT(request: Request) {
  const { id, text, completed } = await request.json();
  await connectToDatabase();
  const todo = await Todo.findByIdAndUpdate(
    id,
    { text, completed },
    { new: true }
  );
  if (!todo) {
    return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
  }
  return NextResponse.json(todo);
}