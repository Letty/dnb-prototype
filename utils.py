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


def getTopicsPercentage(topics):
    number_of_bins = 5  # The number of columns the visualization has
    threshold_percentage = 10

    # Calculate the percentage each topic has
    total = sum(topic['count'] for topic in topics)
    for topic in topics:
        topic['percentage'] = topic['count'] * 100 / total

    # Recalculate to have no values below threshold
    topics = avoidSmallPercentage(
        topics, threshold_percentage / number_of_bins)

    # The percentage each column should hold
    percentage_per_bin = 100 / number_of_bins
    bins = [[] for _ in range(number_of_bins)]  # Create arrays for each column

    # Distribute the topics to the bins
    for bin in bins:
        for topic in topics:
            if (sum(topic['percentage'] for topic in bin) < percentage_per_bin):
                bin.append(topic)
                topics.remove(topic)

    # Sort bins to have the one least filled at front
    bins.sort(key=lambda bin: sum(topic['percentage']
                                  for topic in bin), reverse=True)

    # Distribute the remaining topics to the columns
    current_bin = 0
    for topic in topics:
        bins[current_bin].append(topic)
        current_bin += 1
        if current_bin == number_of_bins:
            current_bin = 0

    # Filter empty columns
    bins = list(filter(lambda bin: len(bin) != 0, bins))

    # Calculate the percentage each topic has of its column
    for bin in bins:
        total = sum(topic['percentage'] for topic in bin)
        for topic in bin:
            topic['percentage'] = topic['percentage'] * 100 / total

        # Recalculate again to have no values below threshold
        bin = avoidSmallPercentage(bin, threshold_percentage)

        # Sort items to have biggest at top
        bin.sort(key=lambda topic: topic['percentage'], reverse=True)

    # Sort bins to have the one with the highest first value first
    bins.sort(key=lambda bin: bin[0]['percentage'], reverse=True)

    # Sort bins to have the one with the least topics first
    # bins.sort(key = lambda bin: len(bin))

    return bins
