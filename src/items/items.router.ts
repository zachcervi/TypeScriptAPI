import express, { Request, Response, NextFunction } from "express";
import * as ItemService from "./items.service";
import { BaseItem, Item } from "./item.interface";

/**
 * Router Definition
 */
export const itemsRouter = express.Router();

/**
 * Controller Definitions
 */
itemsRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const items: Item[] = await ItemService.findAll();
      res.status(200).send(items);
    } catch (e: unknown) {
      next(e); // Use next to handle error properly
    }
  }
);

// GET items/:id
itemsRouter.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const id: number = parseInt(req.params.id, 10);
    try {
      const item = await ItemService.find(id);
      if (item) {
        res.status(200).send(item);
      } else {
        res.status(404).send("Item not found");
      }
    } catch (e: unknown) {
      next(e);
    }
  }
);

// POST items
itemsRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const item: BaseItem = req.body as BaseItem;
      const newItem = await ItemService.create(item);
      res.status(201).json(newItem);
    } catch (e: unknown) {
      next(e);
    }
  }
);

// PUT items/:id
itemsRouter.put(
  "/:id",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const id: number = parseInt(req.params.id, 10);
    try {
      const itemUpdate: Item = req.body as Item;
      const existingItem = await ItemService.find(id);

      if (existingItem) {
        const updatedItem = await ItemService.update(id, itemUpdate);
        res.status(200).json(updatedItem);
      } else {
        const newItem = await ItemService.create(itemUpdate);
        res.status(201).json(newItem);
      }
    } catch (e: unknown) {
      next(e);
    }
  }
);

// DELETE items/:id
itemsRouter.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id: number = parseInt(req.params.id, 10);
      await ItemService.remove(id);
      res.sendStatus(204);
    } catch (e: unknown) {
      next(e);
    }
  }
);