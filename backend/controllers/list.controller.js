import List from "../models/list.js";
import board from "../models/Board.js";
import Board from "../models/Board.js";
export const createList = async (req, res) => {
  try {
    const { title, boardId } = req.body;
    // 1. Validation
    if (!title || !boardId) {
      return res
        .status(400)
        .json({ message: "Title and Board Id both required" });
    }
    // 2. Check if Board exists
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(400).json({ message: "Board does not exist" });
    }
    // 3. Authorization check (Owner or Member)
    const userIdStr = req.user._id.toString();
    const isOwner = board.owner.toString() === userIdStr;
    const isMember = board.members.some(
      (memberId) => memberId.toString() === userIdStr,
    );

    if (!isOwner && !isMember) {
      return res
        .status(403)
        .json({ message: "Not authorized to add lists to this board" });
    }

    const listCount = List.countDocuments({ boardId });
    const position = listCount + 1;

    const list = await List.create({ title, boardId, position });
    res.status(201).json({
      message: "List created Successfully",
      list,
    });
  } catch (error) {
    console.log(`error in create List ${error.message}`);
    return res.status(500).json({ message: "Internal server Error" });
  }
};

export const getListByBoard = async (req, res) => {
  try {
    const { boardId } = req.params;
    // 1. Validation
    if (!boardId) {
      return res.status(400).json({ message: "Board Id is required" });
    }
    // 2. Check if Board exists
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(400).json({ message: "Board does not exist" });
    }
    // 3. Authorization check (Owner or Member)
    const userIdStr = req.user._id.toString();
    const isOwner = board.owner.toString() === userIdStr;
    const isMember = board.members.some(
      (memberId) => memberId.toString() === userIdStr,
    );

    if (!isOwner && !isMember) {
      return res
        .status(403)
        .json({ message: "Not authorized to add lists to this board" });
    }

    const myLists = await List.find({ boardId }).sort({ position: 1 });
    res.status(200).json({
      message: "Lists fetched successfully",
      myLists,
    });
  } catch (error) {
    console.log(`error in getListByBoard ${error.message}`);
    return res.status(500).json({ message: "Internal server Error" });
  }
};

export const updateList = async (req, res) => {
  try {
    const listId = req.params.id;
    const { title, position } = req.body;

    const list = await List.findById(listId);
    if (!list) {
      return res.status(400).json({
        message: "List does not exists",
      });
    }
    const updatedList = await List.findByIdAndUpdate(
      listId,
      {
        title,
        position,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      message: "List updated Successfully",
      list: updatedList,
    });
  } catch (error) {
    console.log(`error in updateList ${error.message}`);
    return res.status(500).json({ message: "Internal server Error" });
  }
};

export const deleteList = async (req, res) => {
  try {
    const listId = req.params.id;
    const list = await List.findById(listId);
    if (!list) {
      return res.status(400).json({
        message: "List does not exists",
      });
    }

    // TODO : CleanUp Card

    const deletedList = await List.findOneAndDelete(listId);
    res.status(200).json({
      message: "List Deleted successfully",
      deletedList,
    });
  } catch (error) {
    console.log(`error in DeleteList ${error.message}`);
    return res.status(500).json({ message: "Internal server Error" });
  }
};
