import { User } from "../../models/user.js";
import { Property } from "../../models/property.js";

const publicProjection =
  "user_id fullName email about profileImage role businessName licenseNumber publicLocation verified phone showPhone showEmail links";
const propertyProjection =
  "property_id name address type transactionType price paymentFrequency images currency";

export const getUser = async function (req, res) {
  const { id } = req.params;
  const { excludePropertyId } = req.query;
  try {
    const user = await User.findOne({ user_id: id })
      .select(publicProjection)
      .lean();
    if (!user) {
      return res.status(404).send({ message: "Error: Can not find user." });
    }
    const propertyQuery = {
      user_id: id,
      isActive: true,
      ...(excludePropertyId && { property_id: { $ne: excludePropertyId } }),
    };
    const [properties, activePropertyCount] = await Promise.all([
      Property.find(propertyQuery)
        .select(propertyProjection)
        .sort({ createdAt: -1 })
        .limit(6)
        .lean(),
      Property.countDocuments({ user_id: id, isActive: true }),
    ]);

    const publicUser = {
      user_id: user.user_id,
      fullName: user.fullName,
      about: user.about,
      profileImage: user.profileImage,
      role: user.role,
      businessName: user.businessName,
      licenseNumber: user.licenseNumber,
      publicLocation: user.publicLocation,
      links: user.links,
      verified: user.verified,
      ...(user.showPhone && user.phone && { phone: user.phone }),
      ...(user.showEmail && user.email && { email: user.email }),
      activePropertyCount,
      properties,
    };

    return res.status(200).send({ data: publicUser });
  } catch (error) {
    req.log.error({ err: error }, "Public user fetch failed");
    return res.status(500).send({ message: "Error: Unable to fetch user." });
  }
};
