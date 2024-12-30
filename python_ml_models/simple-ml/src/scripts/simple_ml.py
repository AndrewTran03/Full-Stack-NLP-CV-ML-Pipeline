import os
import pickle
import time
from dataclasses import dataclass
from typing import Dict, List, NamedTuple, Tuple, TypedDict, Union, cast

import contractions
import nltk
import numpy as np
import pika
import spacy_universal_sentence_encoder
from nltk import pos_tag
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import RegexpTokenizer
from sklearn.tree import DecisionTreeClassifier

from src.utils.logging import LOGGER


# CONSTANTS
@dataclass
class CONSTANTS(NamedTuple):
    ML_MODEL_FALLBACK_TOKEN_RESULT = "<NO-RESULT>"
    ML_MODEL_PATH = "src/models/dt_classifier_model.pkl"
    LABEL_ENCODER_PATH = "src/models/classification_label_encoder_mapping_results.pkl"


# TYPES
class PredictionDict(TypedDict):
    prediction: str


# Downloading NLTK dependenices
nltk.download("stopwords")
nltk.download("wordnet")
nltk.download("averaged_perceptron_tagger_eng")

# NLTK stopwords vocabulary
nltk_en_stopwords = set(stopwords.words("english"))
print(f"STOPWORDS SET: {nltk_en_stopwords}")

nltk_word_lemmatizer = WordNetLemmatizer()
print(nltk_word_lemmatizer)

# Regex here from documentation catches all punctuation but avoids contractions (resource link provided above for reference)
nltk_regex_tokenizer = RegexpTokenizer(r"\w+")
print(nltk_regex_tokenizer)

# Load the Universal Sentence Encoder Model (from Spacy)
SPACY_USE_NLP_MODEL = spacy_universal_sentence_encoder.load_model("en_use_md")
print(SPACY_USE_NLP_MODEL)


def lemmatizer_convert_penn_treeback_parts_of_speech(pt_pos: str) -> str:
    if pt_pos.startswith("N"):  # noun case
        return "n"
    elif pt_pos.startswith("J"):  # adjective case
        return "a"
    elif pt_pos.startswith("V"):  # verb case
        return "v"
    elif pt_pos.startswith("R"):  # adverb base
        return "r"
    else:  # All other cases - default to noun case
        return "n"


def nltk_process_text(email_body_contents: str) -> str:
    # print(f"[{i}] Old: {sentence_entry_text}")

    # Resolving contractions by breaking them up if seen in each sentence
    sentence_entry_text_contractions_fixed: List[str] = []
    for word in str(email_body_contents).strip().split():
        contractions_fixed = cast(
            Union[Tuple[str, List[Tuple[str, str]]], str], contractions.fix(word)
        )
        # Flatten the tuple (Tuple[str, List[Tuple[str, str]]]) into a list of strings
        if isinstance(contractions_fixed, Tuple):
            (tuple_string, list_of_tuples) = contractions_fixed

            # Flatten the list of tuples into individual strings and append to the result
            flattened_list = [tuple_string]
            flattened_list.extend(
                [item for sublist in list_of_tuples for item in sublist]
            )
            sentence_entry_text_contractions_fixed.extend(flattened_list)
        else:  # isinstance(contractions_fixed, str)
            sentence_entry_text_contractions_fixed.append(contractions_fixed)

    # Splitting each sentence into words
    sentence_entry_word_tokens: List[str] = nltk_regex_tokenizer.tokenize(
        " ".join(sentence_entry_text_contractions_fixed).rstrip()
    )
    # print(f"Contraction + Tokenize: {sentence_entry_word_tokens}")

    # Removing stopwords and lowercasing all words in each sentence
    sentence_entry_stopwords_filtered_tokens: List[str] = []
    for word in sentence_entry_word_tokens:
        if word.lower() not in nltk_en_stopwords:
            sentence_entry_stopwords_filtered_tokens.append(word.lower())
    # print(f"Stopwords + Lowercase: {sentence_entry_stopwords_filtered_tokens}")

    # Parts-Of-Speech Tagging and Lemmatization of all words in each sentence
    sentence_entry_lemmatized_text: List[str] = []
    sentence_entry_pos_tagged_tokens = pos_tag(sentence_entry_stopwords_filtered_tokens)
    for word, penn_treeback_part_of_speech in sentence_entry_pos_tagged_tokens:
        lemmatizer_part_of_speech = lemmatizer_convert_penn_treeback_parts_of_speech(
            penn_treeback_part_of_speech
        )
        sentence_entry_lemmatized_text.append(
            nltk_word_lemmatizer.lemmatize(word, pos=lemmatizer_part_of_speech)
        )

    # Joining all NLTK-processed words in each sentence back into one string
    final_nltk_processed_text = " ".join(sentence_entry_lemmatized_text).rstrip()
    # print(f"[{i}] New: {final_nltk_processed_text}")
    # print("-----------------")
    return final_nltk_processed_text


def create_text_embedding(nltk_processed_text: str):
    document = SPACY_USE_NLP_MODEL(nltk_processed_text)
    document_vector = document.vector
    return np.asarray(document_vector)


def print_minute_string_helper(time_taken: float) -> str:
    return (
        ""
        if time_taken < 60.00
        else f"(or {time_taken // 60:.2f} minutes and {time_taken % 60:.2f} seconds)"
    )


def predict(email_body_contents: str) -> PredictionDict:
    start_time = time.time()
    if not os.path.exists(CONSTANTS.ML_MODEL_PATH) or not os.path.exists(
        CONSTANTS.LABEL_ENCODER_PATH
    ):
        LOGGER.error(
            "Error: ML Model (or Label-Encoder Classifcation Mapping Association) does NOT exist"
        )
        end_time = time.time()
        time_taken = end_time - start_time
        LOGGER.debug(
            f"Time Taken (Prediction): {time_taken:.2f} seconds {print_minute_string_helper(time_taken)}"
        )
        return {"prediction": CONSTANTS.ML_MODEL_FALLBACK_TOKEN_RESULT}

    with open(CONSTANTS.ML_MODEL_PATH, "rb") as predict_file, open(
        CONSTANTS.LABEL_ENCODER_PATH, "rb"
    ) as label_enocder_file:
        ml_model: DecisionTreeClassifier = pickle.load(predict_file)
        LOGGER.debug(f"Model: {ml_model.__class__.__name__}")

        nltk_processed_text: str = nltk_process_text(email_body_contents)
        X_pred_text_embedding: np.ndarray = create_text_embedding(nltk_processed_text)
        y_pred_result: np.ndarray = ml_model.predict(X=[X_pred_text_embedding])
        LOGGER.debug(
            f"Email Classification Result (Numerical): '{y_pred_result}'"
        )  # Expected: [0] or [1] (or error with Fallback Token)

        label_encoder_mapping: Dict[int, str] = pickle.load(label_enocder_file)
        LOGGER.debug(f"Label Encoder Mapping: {label_encoder_mapping}")
        result = label_encoder_mapping.get(
            y_pred_result[0], CONSTANTS.ML_MODEL_FALLBACK_TOKEN_RESULT
        ).capitalize()
        LOGGER.debug(f"Email Classification Result (String): '{result}'")

        end_time = time.time()
        time_taken = end_time - start_time
        LOGGER.debug(
            f"Time Taken (Prediction): {time_taken:.2f} seconds {print_minute_string_helper(time_taken)}"
        )

        return {"prediction": result}


def main() -> None:
    print("Hello World")

    # Test logging capabilities
    LOGGER.info("Hello World")
    LOGGER.debug("Hello World")
    LOGGER.warning("Hello World")
    LOGGER.error("Hello World")
    LOGGER.critical("Hello World")

    # Test ML model (Printing the result - for now)
    print(predict("This is not a spam email"))

    return None


if __name__ == "__main__":
    main()
