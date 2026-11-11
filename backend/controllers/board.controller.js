import Board from "../models/Board.js";
import Card from "../models/Card.js";
import List from "../models/list.js";

export const createBoard = async (req, res) => {
  try {
    const { title, members, description } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title required" }); // 400 Bad request
    }

    const board1 = await Board.create({
      title,
      description,
      owner: req.user._id, // verified owner by jwt
      members: members || [], // Optional collaborators list
      lists: [
        { title: "To Do", cards: [] },
        { title: "In Progress", cards: [] },
        { title: "Done", cards: [] },
      ],
    });

    res.status(201).json({
      success: true,
      board: board1,
    });
  } catch (error) {
    console.log("Error in creating Board 😕: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getBoards = async (req, res) => {
  try {
    const myBoards = await Board.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    }).populate("owner", "name email");

    if (myBoards.length === 0)
      return res
        .status(400)
        .json({ message: "your boards do not exist, Create a new one" });

    res.status(200).json({ success: true, myBoards });
  } catch (error) {
    console.log(`error happened in getBoards: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getBoardById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Board id not found" });
    }

    const board = await Board.findById(id).populate({
      path: "lists.cards",
    });
    if (!board) {
      return res.status(404).json({ message: "board not found" });
    }

    res.status(200).json({ success: true, board });
  } catch (error) {
    console.log(`error happened in getBoardsById: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteBoard = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Board id not found" });
    }
    const board = await Board.findById(id);
    if (!board) {
      return res.status(404).json({ message: "board not found" });
    }

    // Security check: Only the board owner can delete it
    if (board.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this board" });
    }
    await Card.deleteMany({ id });
    await List.deleteMany({ id });
    await board.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Board deleted successfully", board });
  } catch (error) {
    console.log(`error happened in deleteBoard: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// PUT /api/boards/:boardId
export const updateBoard = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { title, description } = req.body;

    // Find the board and ensure the logged-in user is the owner or member
    const board = await Board.findById(boardId);

    if (!board) {
      return res
        .status(404)
        .json({ success: false, message: "Board not found" });
    }

    // Optional: Check if user owns the board
    if (board.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this board",
      });
    }

    if (title) board.title = title;
    if (description !== undefined) board.description = description;

    await board.save();

    res.status(200).json({
      success: true,
      message: "Board updated successfully",
      board,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
