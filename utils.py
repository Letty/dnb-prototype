def seq_iter(obj):
    return obj if isinstance(obj, dict) else range(len(obj))


def avoidSmallPercentage(values, threshold):
    missing_percentage = 0
    percentage_above_threshold = 0

    # Find out how much percentage is missing and how much is above the
    # threshold
    for value in values:
        if (value['percentage'] < (threshold)):
            missing_percentage += threshold - value['percentage']
        else:
            percentage_above_threshold += value['percentage']

    # This method is not completly clean. The sum of the resulting percentages
    # are above 100 if items are higher than the threshold but would fall
    # below if subtracted.
    if (missing_percentage > 0):
        for value in values:
            # Calculate the needed subtraction
            value_subtraction = value['percentage'] / \
                percentage_above_threshold * missing_percentage
            # Check if item would be below threshold after subtraction
            if (value['percentage'] - value_subtraction < (threshold)):
                value['percentage'] = (threshold)
            else:
                value['percentage'] = value['percentage'] - value_subtraction

    return values
