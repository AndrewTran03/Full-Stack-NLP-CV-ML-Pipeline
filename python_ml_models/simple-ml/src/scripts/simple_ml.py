import os
import pickle
from typing import TypedDict

import pika
from sklearn.tree import DecisionTreeClassifier

from src.utils.logging import LOGGER

# CONSTANTS
ML_MODEL_PATH = "src/models/dt_classifier_model.pkl"


class PredictionDict(TypedDict):
    prediction: str


def predict() -> PredictionDict:
    if not os.path.exists(ML_MODEL_PATH):
        LOGGER.error("Error: Model does NOT exist")
        return {"prediction": ""}

    with open(ML_MODEL_PATH, "rb") as predict_file:
        ml_model: DecisionTreeClassifier = pickle.load(predict_file)
        LOGGER.debug(f"Model: {ml_model.__class__.__name__}")
        result = "GOT HERE"
        return {"prediction": f"Hello World - {result}"}


def main() -> None:
    print("Hello World")

    # Test logging capabilities
    LOGGER.info("Hello World")
    LOGGER.debug("Hello World")
    LOGGER.warning("Hello World")
    LOGGER.error("Hello World")
    LOGGER.critical("Hello World")

    # Test ML model (Printing the result - for now)
    print(predict())

    return None


if __name__ == "__main__":
    main()
