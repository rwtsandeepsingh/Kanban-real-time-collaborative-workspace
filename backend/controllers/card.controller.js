import Board from "../models/Board.js";
import Card from "../models/Card.js";
export const createCard = async (req, res) => {
  try {
    const { title, description, listId, boardId } = req.body;
    if (!title || !listId || !boardId) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const cardCount = await Card.countDocuments({ listId });
    const position = cardCount + 1;

    const myCard = await Card.create({
      title,
      description,
      listId,
      boardId,
      position,
    });

    res.status(201).json({
      success: true,
      myCard,
    });
  } catch (error) {
    console.log(`Error happend in Create card component ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCardsByBoard = async (req, res) => {
  try {
    const { boardId } = req.params;
    if (!boardId) {
      return res.status(400).json({
        message: "boardId not given",
      });
    }

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(400).json({
        message: "boardId doesnot exists",
      });
    }

    const cards = await Card.find({ boardId })
      .populate("assignedTo", "name email")
      .sort({ position: 1 });
    res.status(200).json({
      success: true,
      cards,
    });
  } catch (error) {
    console.log(`Error happend in Create card component ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    if (!cardId) {
      return res.status(400).json({
        message: "CardId not found",
      });
    }

    const { title, description, assignedTo } = req.body;
    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { title, description, assignedTo },
      {
        new: true,
      },
    );
    if (!updatedCard) {
      return res.status(404).json({ message: "Card not found" });
    }
    res.status(200).json({
      success: true,
      updatedCard,
    });
  } catch (error) {
    console.log(`Error happend in update card controller ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    if (!cardId) {
      return res.status(400).json({
        message: "CardId not found",
      });
    }
    const deletedCard = await Card.findByIdAndDelete(cardId);
    if (!deletedCard) {
      return res.status(404).json({ message: "Card not found" });
    }
    res.status(200).json({
      message: "Card deleted successfully",
      deletedCard,
    });
  } catch (error) {
    console.log(`Error happend in delete card controller ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const moveCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { destinationListId, newPosition } = req.body;

    if (!destinationListId || newPosition === undefined) {
      return res.status(400).json({
        message: "Destination ListId and new position required",
      });
    }

    // Find target Card
    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({
        message: "Card not found",
      });
    }

    const sourceListId = card.listId;

    // Senerio1 = Moving card to a different list

    if (sourceListId.toString() !== destinationListId.toString()) {
      // Step A: Close gap in original (source) List
      // Shift cards below the position UP by 1

      await Card.updateMany(
        { listId: sourceListId, position: { $gt: card.position } },
        { $inc: { position: -1 } },
      );

      // Step B : make space in target(Destination) list
      // Shift card at or below newPosition down by +1

      await Card.updateMany(
        { listId: destinationListId, position: { $gte: newPosition } },
        { $inc: { position: 1 } },
      );

      //Step C :Update targeted card's ListId and position
      card.listId = destinationListId;
      card.position = newPosition;

      await card.save();
    }
    // Senarion 2 : Reordering within the same list
    else {
      if (newPosition > card.position) {
        // Moving down :Shift Items between old and new position UP (-1)
        await Card.updateMany(
          {
            listId: sourceListId,
            positon: { $gt: card.position, $lte: newPosition },
          },
          { $inc: { positon: -1 } },
        );
      } else if (newPosition < card.position) {
        await Card.updateMany(
          {
            listId: sourceListId,
            position: { $gte: newPosition, $lt: card.position },
          },
          { $inc: { position: 1 } },
        );
      }
      card.position = newPosition;
      await card.save();
    }

    return res.status(200).json({
      message: "Card moved successfully",
      success: true,
      card,
    });
  } catch (error) {
    console.log(`Error in moveCard Controller: ${error.message}`);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
