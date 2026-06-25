"""Functions used in preparing Guido's gorgeous lasagna.

Learn about Guido, the creator of the Python language:
https://en.wikipedia.org/wiki/Guido_van_Rossum

This is a module docstring, used to describe the functionality
of a module and its functions and/or classes.
"""


#TODO (student): define your EXPECTED_BAKE_TIME (required) and PREPARATION_TIME (optional) constants below.
EXPECTED_BAKE_TIME = 40
print(EXPECTED_BAKE_TIME)
PREPARATION_TIME = 35

#TODO (student): Remove 'pass' and complete the 'bake_time_remaining()' function below.
def bake_time_remaining(elapsed_bake_time):
    """Calculate the bake time remaining.

    Parameters:
        elapsed_bake_time (int): The baking time already elapsed.

    Returns:
        int: The remaining bake time (in minutes) derived from 'EXPECTED_BAKE_TIME'.

    Function that takes the actual minutes the lasagna has been in the oven as
    an argument and returns how many minutes the lasagna still needs to bake
    based on the `EXPECTED_BAKE_TIME`.
    """

   
    time_remaining = EXPECTED_BAKE_TIME - elapsed_bake_time
    return time_remaining


"""TODO (student): Define the 'preparation_time_in_minutes()' function below.
 To avoid the use of magic numbers (see: https://en.wikipedia.org/wiki/Magic_number_(programming)), you should define a PREPARATION_TIME constant.
 You can do that on the line below the 'EXPECTED_BAKE_TIME' constant.
 This will make it easier to do calculations, and make changes to your code.
"""

def preparation_time_in_minutes(number_of_layers):
    """Calculate the preparation time in minutes.

    Parameters:
    number_of_layers (int): The number of layers in the lasagna.

    Returns:
    int: preparation time in minutes.(prep_time)
    
    This function takes one integer representing the number of layers in lasagna.
    the preparation time in minites is calculated by multiplying the number of layers with 2.
    """
    
    prep_time = number_of_layers*2
    return prep_time
    

#TODO (student): define the 'elapsed_time_in_minutes()' function below.
def elapsed_time_in_minutes(numbre_of_layers, elapsed_bake_time):
    """Calculate the elapsed cooking time.

    Parameters:
    number_of_layers (int): The number of layers in the lasagna.
    elapsed_bake_time (int): Time the lasagna has been baking in the oven.

    Returns:
    int: The total time elapsed (in minutes) preparing and baking.

    This function takes two integers representing the number of lasagna layers and the time already spent baking the lasagna. It calculates the total elapsed minutes spent cooking (preparing + baking).
    
    """
    
    time_elapsed = elapsed_bake_time + 2*numbre_of_layers
    return time_elapsed



# TODO (student): Remember to go back and add docstrings to all your functions
#  (you can copy and then alter the one from bake_time_remaining.)
