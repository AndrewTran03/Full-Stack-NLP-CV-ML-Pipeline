import pika

from src.utils.logging import LOGGER

def main() -> None:
    print("Hello World")
    
    # Test logging capabilities
    LOGGER.info("Hello World")
    LOGGER.debug("Hello World")
    LOGGER.warning("Hello World")
    LOGGER.error("Hello World")
    LOGGER.critical("Hello World")
    
    return None

if __name__ == "__main__":
    main()
